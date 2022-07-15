const db_transazioni = require('../model/transazioni').transazioni;

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();

class slotController {

    constructor(){}

    async reserveSlot(req){

        /*
        {
            "id": 0,       // id del producer verso il quale si vuole opzionare lo slot
            "slot": 0-23,  // fascia oraria che si desidera opzionare. lo slot 0 va da 00:00 a 00:59
            "kw": 15       // numero di kw che si vogliono prenotare per quello specifico slot
        }
        */

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(req.body.slot, 0, 0, 0);

        let selected_slot; // è il nome dello slot selezionato: "slot_0"
        let slot_costo;    // è il costo per kw dello slot
        let slot_totale;   // è il quantitativo totale di energia messo a disposizione dal produttore
        let slot_rimanente;// è il quantitativo di energia messo a disposizione - quantitativo di energia opzionata

        let result_p = await producerController.getProducer(req);
        let producer = result_p[1]
        
        let result_c = await consumerController.getConsumerById(req.user.id);
        let consumer = result_c[1]

        // CONTROLLO VALIDITA' RICHIESTA DEL CONSUMER ====================================================================================================
        // controllo esistenza produttore di energia

        // controllo validità dello slot selezionato
        if(req.body.slot >= 0 && req.body.slot <= 23){ 

            selected_slot = "slot_" + String(req.body.slot)              // ottengo lo slot richiesto dal consumer
            let selected_slot_data = JSON.parse(producer[selected_slot]) // ottengo i dati dello slot

            slot_costo = selected_slot_data.costo;
            slot_totale = selected_slot_data.totale;
            slot_rimanente = selected_slot_data.rimanente;

        } else return [404, "ERROR: requested slot does not exist"]

        // controllo validità data della prenotazione
        console.log(this.diff_hours(tomorrow, today))
        if(this.diff_hours(tomorrow, today) < 24) return [403, "FORBIDDEN: selected slot must start 24 hours from now"]

        // controllo credito disponibile del consumer
        if(! (consumer.credito >= (slot_costo*req.body.kw)) ) return [403, "FORBIDDEN: insufficient credit to buy the slot"]

        // controllo validità energetica richiesta: se un consumatore richiede troppa poca energia
        if(req.body.kw < 0.1) return [403, "FORBIDDEN: consumer must select at least 0.1 kwh"]

        // controllo validità energetica richiesta: se un consumatore ne richiede troppa
        if(req.body.kw > slot_totale) return [403, "FORBIDDEN: the demanded energy is exceedes the maximum capacity"]
        
        // controllo validità energetica richiesta: se un consumatore richiede più di quella disponibile si effettua un taglio tra tutti i consumatori
        //if(req.body.kw > slot_rimanente) this.balanceSlotRequests(producer, selected_slot)


        // PRENOTAZIONE DELLO SLOT =======================================================================================================================
        
        // aggiorno kw rimanenti per lo slot
        let kw_rimanenti = slot_rimanente - req.body.kw;
        if(kw_rimanenti < 0) return [500, "ERROR: l'energia per lo slot selezionato è terminata o la domanda ne richiede sopra la disponibile"]
        else await producerController.editSlot(req.body.id, req.body.slot, "rimanente", kw_rimanenti)

        // aggiorno credito consumer
        await consumerController.decreaseConsumerCredit(req.user.id, consumer.credito - (req.body.kw*slot_costo))
        
        // crea la transazione a db
        await this.createTransaction(consumer, producer, req, slot_costo, today, tomorrow);

        return [200, "Transazione tra [producer " + producer.id_producer + "] e [consumer "+ consumer.id_consumer + "] registrata con successo"]

    }

    async editSlot(req){

        /*

        {
            "id": 1,    // id producer
            "slot": 15, // numero dello slot da editare
            "kw": 0     // quantitativo di kw da modificare --> se 0 si "cancella" la richiesta (controllare data)
        }

        Dare la possibilità ad un consumatore di modificare 
        (anche cancellare, ovvero imponendo una quantità parti a zero) 
        i quantitativi richiesti per uno o più slot. Se la cancellazione avviene prima 
        delle 24h allora non vi sono costi; se avviene in un periodo temporale inferiore 
        o uguale alle 24 viene addebitato l’intero costo.

        per modificare una prenotazione si deve:
        modificare lo slot interessato del producer interessato rimettendo l'energia e i consumi a posto
        trovare la transazione nel db delle transazioni ed aggiornarla in base alla data (se la richiesta avviene prima dopo le 24 ore il costo non si aggiorna, altrimenti si resetta)
        controllare la data e restituire o meno il credito all'utente

        */
        
        let result_p = await producerController.getProducerById(req.body.id);
        let producer = result_p[1];
    
        let result_c = await consumerController.getConsumerById(req.user.id);
        let consumer = result_c[1];

        let result_t = await this.getTransaction(req.body.id, req.user.id, req.body.slot)
        let transaction = result_t[1]


        // 2 casi: compra meno kw, cancella la prenotazione (compra più kw no perché no)


        // caso kw == 0
        // controlla data
        const now_time = new Date();
        const transaction_time = transaction.data_acquisto_transazione;

        console.log(now_time)
        console.log(transaction_time)






    }

    async getTransaction(id_producer, id_consumer, slot){

        try{

            const transaction = await db_transazioni.findOne({where: { id_producer: id_producer} && {id_consumer: id_consumer} && {slot_selezionato: slot}});
            if( ! transaction) return [404, "transaction not found"]

            return [200, transaction]

        }catch(err){
            return [500, "something went wrong " + err]
        }

    }

    async editTransactionFields(transazione, campo, valore){

        try{

            if(campo === "kw") transazione.update({kw_acquistati: valore});
            else if(campo === "costo") transazione.update({costo_slot: valore});
            else if(campo === "emissioni") transazione.update({emissioni_co2_slot: valore});
            else if(campo === "data_acquisto") transazione.update({data_acquisto_transazione: valore});
            else if(campo === "data_prenotazione") transazione.update({data_prenotazione_transazione: valore});
            else return [500, "ERRORE: campo non modificabile"]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async createTransaction(consumer, producer, req, slot_costo, data_acquisto, data_prenotata){

        // let data 1
        // let data 2

        let costo_transazione = req.body.kw*slot_costo;
        let emissioni_co2_slot = producer.emissioni_co2*req.body.kw;

        try{

            const transazione = await db_transazioni.create({

                id_consumer: consumer.id_consumer,
                id_producer: producer.id_producer,
                emissioni_co2_slot: emissioni_co2_slot,
                costo_slot: costo_transazione,
                kw_acquistati: req.body.kw,
                slot_selezionato: req.body.slot,
                fonte_produzione: producer.fonte_produzione,
                //data_acquisto_transazione: String(data_acquisto),
                //data_prenotazione_transazione: String(data_prenotata)
                data_acquisto_transazione: data_acquisto,
                data_prenotazione_transazione: data_prenotata

            });

            return [200, "SUCCESS: transaction with id " + transazione.id_transazione + " correctly created"]
        
        }catch(err){
            console.log("CONSOLE_LOG: " + err)
            return [500, "ERROR: something went wrong"]
        }

    }

    async balanceSlotRequests(producer, selected_slot){}

    diff_hours(dt2, dt1) {

    //funzione per calcolare la differenza di ore tra 2 date

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.round(Math.abs(diff));

    }

    //funzione per estrarre la data da una stringa in un oggetto Date
    extractDate(string_date){

        let date = new Date(string_date);
        return date;

    }


}





module.exports = slotController;