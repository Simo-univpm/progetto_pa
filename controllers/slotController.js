const db_producers = require('../model/producer').producer;
const db_consumers = require('../model/consumer').consumer;
const db_admins = require('../model/admin').admin;
const db_storico_transazioni = require('../model/storico_transazioni').transazioni;

class slotController {

    constructor(){}

    async reserveSlot(req){

        /*
        {
            "nome": "asd", // nome del producer verso il quale si vuole opzionare lo slot
            "slot": 0-23,  // fascia oraria che si desidera opzionare. lo slot 0 va da 00:00 a 00:59
            "kw": 15       // numero di kw che si vogliono prenotare per quello specifico slot
        }
        */

                                        /////// INSERIRE PIPELINE DI VALIDAZIONE PER FAVORE ///////

        let data_corrente = new Date();
        let data_prenotazione = new Date();

        //data_prenotazione.setDate(data_corrente.getDate()+1);         // si aggiunge un giorno alla data attuale (si può prenotare solo per domani)
        //data_prenotazione = data_prenotazione.getHours() + body.slot; // si aggiungono le ore dello slot per verificare successivamente la validità della richiesta
        
        let selected_slot;          // è il nome dello slot selezionato: "slot_0"
        let selected_slot_data;     // è un json {"totale": x, "rimanente": y}



        // CONTROLLO VALIDITA' RICHIESTA DEL CONSUMER ====================================================================================================
        // controllo esistenza produttore di energia
        let producer = await db_producers.findOne({where: { nome: req.body.nome }});
        if( ! producer) return [404, "producer not found"]

        // controllo validità dello slot selezionato
        if(req.body.slot >= 0 && req.body.slot <= 23){ 

            selected_slot = "slot_" + String(req.body.slot) // append del numero di slot richiesto alla stringa "slot_" --> slot_ + 15 --> slot_15
            selected_slot_data = JSON.parse(producer[selected_slot])

        } 
        else return [404, "ERROR: requested slot does not exist"]


        console.log("data_corrente " + data_corrente)
        console.log("data_prenotazione " + data_prenotazione)

        // controllo validità data della prenotazione
        //if(this.diffHours(data_prenotazione, data_corrente) < 24) return [403, "FORBIDDEN: selected slot must start 24 hours from now"]

        // controllo credito disponibile del consumer
        let consumer = await db_consumers.findOne({where: { id_consumer: req.user.id }});
        if(! (consumer.credito >= producer.costo_per_kwh) ) return [403, "FORBIDDEN: insufficient credit to buy the slot"]

        // controllo validità energetica richiesta: se un consumatore richiede troppa poca energia
        if(req.body.kw < 0.1) return [403, "FORBIDDEN: consumer must select at least 0.1 kwh"]

        // controllo validità energetica richiesta: se un consumatore ne richiede troppa
        if(req.body.kw > selected_slot_data.totale) return [403, "FORBIDDEN: the demanded energy is exceedes the maximum capacity"]
        
        // controllo validità energetica richiesta: se un consumatore richiede più di quella disponibile si effettua un taglio tra tutti i consumatori
        if(req.body.kw > selected_slot_data.rimanente) this.balanceSlotRequests(producer, selected_slot)


        // PRENOTAZIONE DELLO SLOT =======================================================================================================================
        

        selected_slot_data.rimanente -= req.body.kw
        producer.update({selected_slot: selected_slot_data})

        this.updateCredit(req.user.id, req.body.kw) // scala il credito dell'utente e aggiorna il record
        
        // crea la transazione a db
        try{

            const transazione = await db_storico_transazioni.create({

                id_consumer: consumer.id_consumer,
                id_producer: producer.id_producer,
                emissioni_co2_slot: producer.emissioni_co2,
                costo_slot: producer.costo_per_kwh,
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