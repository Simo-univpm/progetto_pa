const db_producers = require('../model/producer').producer;
const db_consumers = require('../model/consumer').consumer;
const db_transazioni = require('../model/transazioni').transazioni;

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

const ProducerController = require('../controllers/producerController');
const consumer = require('../model/consumer');
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

        let data_corrente = new Date();
        let data_prenotazione = new Date();
        //data_prenotazione.setDate(data_corrente.getDate()+1);         // si aggiunge un giorno alla data attuale (si può prenotare solo per domani)
        //data_prenotazione = data_prenotazione.getHours() + body.slot; // si aggiungono le ore dello slot per verificare successivamente la validità della richiesta
        

        let selected_slot; // è il nome dello slot selezionato: "slot_0"
        let slot_totale;   // è il quantitativo totale di energia messo a disposizione dal produttore
        let slot_rimanente;// è il quantitativo di energia messo a disposizione - quantitativo di energia opzionata
        let slot_costo;    // è il costo per kw dello slot


        // CONTROLLO VALIDITA' RICHIESTA DEL CONSUMER ====================================================================================================
        // controllo esistenza produttore di energia
        let producer = await producerController.getProducer(req);

        // controllo validità dello slot selezionato
        if(req.body.slot >= 0 && req.body.slot <= 23){ 

            selected_slot = "slot_" + String(req.body.slot)              // ottengo lo slot richiesto dal consumer
            let selected_slot_data = JSON.parse(producer[selected_slot]) // ottengo i dati dello slot

            slot_totale = selected_slot_data.totale;
            slot_rimanente = selected_slot_data.rimanente;
            slot_costo = selected_slot_data.costo;

        } 
        else return [404, "ERROR: requested slot does not exist"]


        // controllo validità data della prenotazione
        //if(this.diffHours(data_prenotazione, data_corrente) < 24) return [403, "FORBIDDEN: selected slot must start 24 hours from now"]

        // controllo credito disponibile del consumer
        let consumer = await consumerController.getConsumerById(req.user.id);
        if(! (consumer.credito >= slot_costo) ) return [403, "FORBIDDEN: insufficient credit to buy the slot"]

        // controllo validità energetica richiesta: se un consumatore richiede troppa poca energia
        if(req.body.kw < 0.1) return [403, "FORBIDDEN: consumer must select at least 0.1 kwh"]

        // controllo validità energetica richiesta: se un consumatore ne richiede troppa
        if(req.body.kw > slot_totale) return [403, "FORBIDDEN: the demanded energy is exceedes the maximum capacity"]
        
        // controllo validità energetica richiesta: se un consumatore richiede più di quella disponibile si effettua un taglio tra tutti i consumatori
        if(req.body.kw > slot_rimanente) this.balanceSlotRequests(producer, selected_slot)


        // PRENOTAZIONE DELLO SLOT =======================================================================================================================
        
        // aggiorno kw rimanenti per lo slot
        
        await producerController.editSlotKwRemaining(req)


        // aggiorno credito consumer
        let credito_aggiornato = consumer.credito - req.body.kw*producer.costo_per_kwh
        this.updateCredit(req.user.id, credito_aggiornato)
        
        // crea la transazione a db
        try{

            const transazione = await db_transazioni.create({

                id_consumer: consumer.id_consumer,
                id_producer: producer.id_producer,
                emissioni_co2_slot: producer.emissioni_co2,
                costo_slot: producer.costo_per_kwh,
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

    async updateCredit(id, credito){

        try{
            let consumer = await db_consumers.findOne({where: { id_consumer: id }});
            consumer.update({credito: credito})
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