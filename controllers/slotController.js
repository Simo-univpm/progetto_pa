const db_transazioni = require('../model/transazioni').transazioni;

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();

class slotController {

    constructor(){}

    /*
    {
        "id": 0,       // id del producer verso il quale si vuole opzionare lo slot
        "slot": 0-23,  // fascia oraria che si desidera opzionare. lo slot 0 va da 00:00 a 00:59
        "kw": 15       // numero di kw che si vogliono prenotare per quello specifico slot
    }
    */
    async reserveSlot(req){

        //let data_corrente = new Date();
        //let data_prenotazione = new Date();
        //data_prenotazione.setDate(data_corrente.getDate()+1);         // si aggiunge un giorno alla data attuale (si può prenotare solo per domani)
        //data_prenotazione = data_prenotazione.getHours() + body.slot; // si aggiungono le ore dello slot per verificare successivamente la validità della richiesta
        

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
        //if(this.diffHours(data_prenotazione, data_corrente) < 24) return [403, "FORBIDDEN: selected slot must start 24 hours from now"]

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
        await this.createTransaction(consumer, producer, req, slot_costo);

        return [200, "Transazione tra [producer " + producer.id_producer + "] e [consumer "+ consumer.id_consumer + "] registrata con successo"]

    }

    async createTransaction(consumer, producer, req, slot_costo){

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
                //data_acquisto_transazione: data_corrente,
                //data_prenotazione_transazione: data_prenotazione
                data_acquisto_transazione: "ciao",
                data_prenotazione_transazione: "ciao"

            });

            return [200, "SUCCESS: transaction with id " + transazione.id_transazione + " correctly created"]
        
        }catch(err){
            console.log("CONSOLE_LOG: " + err)
            return [500, "ERROR: something went wrong"]
        }

    }

/*
    //calcola la differenza di almeno 24 ore tra 2 date
    diffHours(date1, date2) {
        var diff = (date2.getTime() - date1.getTime()) / 1000;
        diff /= 60 * 60;
        return Math.abs(Math.round(diff));
    }
*/
    async balanceSlotRequests(producer, selected_slot){}

}





module.exports = slotController;