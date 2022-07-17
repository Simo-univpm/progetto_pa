const db_transazioni = require('../model/transazioni').transazioni;

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();

class slotController {

    constructor(){}

    // CRUD =================================================
    async getTransaction(id_producer, id_consumer, slot){

        try{

            const transaction = await db_transazioni.findOne({where: { id_producer: id_producer} && {id_consumer: id_consumer} && {slot_selezionato: slot}});
            if( ! transaction) return [404, "ERRORE: transazione tra [producer " + id_producer + "] e [consumer " + id_consumer + "] per [slot " + slot + "] non trovata."]

            return [200, transaction]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async createTransaction(consumer, producer, slot_costo, data_acquisto, data_prenotata){

        let costo_transazione = data.kw*slot_costo;
        let emissioni_co2_slot = producer.emissioni_co2*data.kw;

        try{

            const transazione = await db_transazioni.create({

                id_consumer: consumer.id_consumer,
                id_producer: producer.id_producer,
                emissioni_co2_slot: emissioni_co2_slot,
                costo_slot: costo_transazione,
                kw_acquistati: data.kw,
                slot_selezionato: data.slot,
                fonte_produzione: producer.fonte_produzione,
                data_acquisto_transazione: data_acquisto,
                data_prenotazione_transazione: data_prenotata

            });

            return [200, "OK: [transazione " + transazione.id_transazione + "] creata."]
        
        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async editTransactionFields(transazione, campo, valore){

        try{

            if(campo === "kw_acquistati") transazione.update({kw_acquistati: valore});
            else if(campo === "costo_slot") transazione.update({costo_slot: valore});
            else if(campo === "emissioni_co2_slot") transazione.update({emissioni_co2_slot: valore});
            else if(campo === "data_acquisto_transazione") transazione.update({data_acquisto_transazione: valore});
            else if(campo === "data_prenotazione_transazione") transazione.update({data_prenotazione_transazione: valore});
            else return [500, "ERRORE: campo [" + campo + "] non modificabile"];

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    //funzione per cancellare la transazione dal db
    async delete(id){

        try{

            await db_transazioni.destroy({ where: { id_transazione: id } });
            return [200, "OK: [transazione " + id + "] eliminata."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }
    // ======================================================

    // consegna =============================================
    async reserveSlot(data, id_consumer){

        /*
        data contiene:
        {
            "id": 0,       // id del producer verso il quale si vuole opzionare lo slot
            "slot": 0-23,  // fascia oraria che si desidera opzionare. lo slot 0 va da 00:00 a 00:59
            "kw": 15       // numero di kw che si vogliono prenotare per quello specifico slot
        }
        */

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(data.slot, 0, 0, 0);

        let selected_slot;  // è il nome dello slot selezionato: "slot_0"
        let slot_costo;     // è il costo per kw dello slot
        let slot_totale;    // è il quantitativo totale di energia messo a disposizione dal produttore
        let slot_rimanente; // è il (quantitativo di energia messo a disposizione - quantitativo di energia opzionata)

        let result_p = await producerController.getProducer(data.id);
        let producer = result_p[1]
        
        let result_c = await consumerController.getConsumer(id_consumer);
        let consumer = result_c[1]

        // CONTROLLO VALIDITA' RICHIESTA DEL CONSUMER ====================================================================================================
        // controllo esistenza produttore di energia

        // controllo validità dello slot selezionato
        if(data.slot >= 0 && data.slot <= 23){ 

            selected_slot = "slot_" + String(data.slot) // ottengo lo slot richiesto dal consumer
            let selected_slot_data = JSON.parse(producer[selected_slot]) // ottengo i dati dello slot

            slot_costo = selected_slot_data.costo;
            slot_totale = selected_slot_data.totale;
            slot_rimanente = selected_slot_data.rimanente;

        } else return [404, "ERRORE: [slot " + data.slot + "] non esistente."]

        // controllo validità data della prenotazione
        if(this.diff_hours(tomorrow, today) < 24) return [403, "PROIBITO: selezionare uno slot ad una distanza di 24 ore."]

        // controllo credito disponibile del consumer
        if(! (consumer.credito >= (slot_costo*data.kw)) ) return [403, "PROIBITO: [consumer " + id_consumer + "] non dispone di credito sufficiente."]

        // controllo validità energetica richiesta: se un consumatore richiede troppa poca energia
        if(data.kw < 0.1) return [403, "PROIBITO: [consumer "+ id_consumer +" deve selezionare almeno 0.1 kw."]

        // controllo validità energetica richiesta: se un consumatore ne richiede troppa
        if(data.kw > slot_totale) return [403, "PROIBITO: [slot " + slot + "non dispone di energia a sufficienza per soddisfare la richiesta."]
        
        // TODO !! 
        // controllo validità energetica richiesta: se un consumatore richiede più di quella disponibile si effettua un taglio tra tutti i consumatori
        //if(data.kw > slot_rimanente) this.balanceSlotRequests(producer, selected_slot)


        // PRENOTAZIONE DELLO SLOT =======================================================================================================================
        
        // aggiorno kw rimanenti per lo slot
        let kw_rimanenti = (slot_rimanente - data.kw)
        if(kw_rimanenti < 0) return [403, "PROIBITO: [slot " + slot + "non dispone di energia a sufficienza per soddisfare la richiesta."]
        else await producerController.editSlot(data.id, data.slot, "rimanente", kw_rimanenti)

        /// TODO CONTROLLA SE FUNZIONA CORRETTAMENTE L'AGGIORNAMENTO DEL CREDITO
        // aggiorno credito consumer
        await consumerController.editConsumerCredit(id_consumer, (consumer.credito - (data.kw*slot_costo)))
        
        // crea la transazione a db
        await this.createTransaction(consumer, producer, slot_costo, today, tomorrow);

        return [200, "Transazione tra [producer " + producer.id_producer + "] e [consumer "+ consumer.id_consumer + "] registrata con successo"]

    }

    async editSlot(data, id_consumer){

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
        
        let result_p = await producerController.getProducer(data.id);
        let producer = result_p[1];
    
        let result_c = await consumerController.getConsumer(id_consumer);
        let consumer = result_c[1];

        let result_t = await this.getTransaction(data.id, id_consumer, data.slot)
        let transaction = result_t[1]


        let date_1 = new Date() // data attuale
        let date_2 = new Date(transaction.data_prenotazione_transazione) // data prenotazione dello slot

        if(data.kw == 0){
            
            // caso testato e funzionante
            if(this.diff_hours(date_2, date_1) < 24)
            {
                // se non ci sono almeno 24 ore:

                let valore_slot = await producerController.getSlotValue(data.id, data.slot, "rimanente")
                let valore_aggiornato = valore_slot[1] + transaction.kw_acquistati
                
                await producerController.editSlot(data.id, data.slot, "rimanente", valore_aggiornato) // si restituiscono i kw allo slot del producer
                await this.editTransactionFields(transaction, "emissioni_co2_slot", 0) // si azzerano le emissioni della transazione
                await this.editTransactionFields(transaction, "kw_acquistati", 0) // si azzerano i kw acquistati della transazione

                return [200, "OK: transazione [consumer " + id_consumer + "] verso [ producer " + data.id + "] annullata. Emissioni e kw della transazione azzerati, kw restituiti a [producer " + data.id + "], credito NON restituto a [consumer " + id_consumer + "] (tempo < 24 ore)"]

            }

            // caso testato e funzionante
            if(this.diff_hours(date_2, date_1) >= 24) {

                // se ci sono almeno 24 ore: 
                let valore_slot = await producerController.getSlotValue(data.id, data.slot, "rimanente")
                let valore_aggiornato = valore_slot[1] + transaction.kw_acquistati
                
                await producerController.editSlot(data.id, data.slot, "rimanente", valore_aggiornato) // si restituiscono i kw allo slot del producer
                await consumerController.editConsumerCredit(id_consumer, (consumer.credito + transaction.costo_slot)) // si riassegna il credito al consumer
                await this.delete(transaction.id_transazione) // si cancella la transazione

                return [200, "OK: transazione [consumer " + id_consumer + "] verso [ producer " + data.id + "] annullata. Transazione cancellata dal db, kw restituiti a [producer " + data.id + "], credito restituto a [consumer " + id_consumer + " (tempo >= 24 ore)"]

            }

        } // fine caso kw richiesti = 0 --> body.kw == 0


        // caso kw > 0 con un acquisto di slot già prenotato
        
        if(data.kw > 0){
            //controllare se esiste già una transazione per lo slot con lo stesso id_producer e id_consumer

            if(this.diff_hours(date_2, date_1) >= 24)
            {
                // se ci sono almeno 24 ore: 
                let valore_slot = await producerController.getSlotValue(data.id, data.slot, "rimanente")
                let valore_aggiornato = valore_slot[1] + transaction.kw_acquistati
                
                await producerController.editSlot(data.id, data.slot, "rimanente", valore_aggiornato) // si restituiscono i kw allo slot del producer
                await consumerController.editConsumerCredit(id_consumer, (consumer.credito + transaction.costo_slot)) // si riassegna il credito al consumer
                await this.delete(transaction.id_transazione) // si cancella la transazione

                //si crea una nuova transazione con i nuovi kw
                const result = await this.reserveSlot(data)
                return [result[0], result[1]]

            }else return [500, "ERRORE: la transazione non può essere modificata prima di 24 ore"]

        }
        
        /// rimuovi
        return [500, "ERROR: hai beccato il caso base"]

    }

    // TODO !!
    async balanceSlotRequests(producer, selected_slot){}

    //funzione per calcolare la differenza di ore tra 2 date
    diff_hours(dt2, dt1) {
    
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        return Math.round(Math.abs(diff));
    
    }

}


module.exports = slotController;