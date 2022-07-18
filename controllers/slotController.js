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

            const transaction = await db_transazioni.findOne({where: {id_producer: id_producer, id_consumer: id_consumer, slot_selezionato: slot}});
            if( ! transaction) return [404, "ERRORE: transazione tra [producer " + id_producer + "] e [consumer " + id_consumer + "] per [slot " + slot + "] non trovata."]

            return [200, transaction]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async createTransaction(consumer, producer, req, slot_costo, data_acquisto, data_prenotata){

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

    // consegna =============================================
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

        let selected_slot;  // è il nome dello slot selezionato: "slot_0"
        let slot_costo;     // è il costo per kw dello slot
        let slot_totale;    // è il quantitativo totale di energia messo a disposizione dal produttore
        let slot_rimanente; // è il quantitativo di energia messo a disposizione - quantitativo di energia opzionata

        let result_p = await producerController.getProducerById(req.body.id);
        let producer = result_p[1]
        
        let result_c = await consumerController.getConsumerById(req.user.id);
        let consumer = result_c[1]
        
        let result_t = await this.getTransaction(req.body.id, req.user.id, req.body.slot)
        let transaction = result_t[1]


        // CONTROLLO VALIDITA' RICHIESTA DEL CONSUMER ====================================================================================================
        
        // controlla l'esistenza della transazione
        if(transaction.id_transazione) return [400, "ERRORE: [slot " + req.body.slot + "] gia' acquistato: possibile la modifica, non la prenotazione."]

        // controllo validità dello slot selezionato
        if(req.body.slot >= 0 && req.body.slot <= 23){ 

            selected_slot = "slot_" + String(req.body.slot)              // ottengo lo slot richiesto dal consumer
            let selected_slot_data = JSON.parse(producer[selected_slot]) // ottengo i dati dello slot

            slot_costo = selected_slot_data.costo;
            slot_totale = selected_slot_data.totale;
            slot_rimanente = selected_slot_data.rimanente;

        } else return [404, "ERRORE: [slot " + req.body.slot + "] non esistente."]

        // controllo validità data prenotazione
        if(this.diff_hours(tomorrow, today) < 24) return [403, "PROIBITO: selezionare uno slot ad una distanza di almeno 24 ore."]

        // controllo credito disponibile del consumer
        if(! (consumer.credito >= (slot_costo*req.body.kw)) ) return [403, "PROIBITO: [consumer " + req.user.id + "] non dispone di credito sufficiente."]

        // controllo validità energetica richiesta: se un consumatore richiede troppa poca energia
        if(req.body.kw < 0.1) return [403, "PROIBITO: [consumer "+ req.user.id +"] deve selezionare almeno 0.1 kw."]

        // controllo validità energetica richiesta: se un consumatore ne richiede troppa
        if(req.body.kw > slot_totale) return [403, "PROIBITO: la richiesta supera il tetto massimo disponibile per [slot " + req.body.slot + "] "]
        
        // controllo validità energetica richiesta: se un consumatore richiede più di quella disponibile si effettua un taglio tra tutti i consumatori
        if(req.body.kw >= slot_rimanente) {
            // si bilanciano le richieste e si interrompe prematuramente l'esecuzione della funzione
            // consumer, producer, req, slot_costo, today, tomorrow
            await this.balanceSlotRequests(req, slot_totale, slot_rimanente, slot_costo, producer.emissioni_co2, consumer, producer, today, tomorrow)
            return [200, "OK: troppe richieste per [slot " + req.body.slot +"], effettuato taglio lineare sulle richieste."]
        }


        // PRENOTAZIONE DELLO SLOT =======================================================================================================================
        
        // aggiorno kw rimanenti per lo slot
        let kw_rimanenti = slot_rimanente - req.body.kw;
        //if(kw_rimanenti < 0) return [403, "PROIBITO: [slot " + req.body.slot + "] non dispone di energia a sufficienza per soddisfare la richiesta."]
        await producerController.editSlot(req.body.id, req.body.slot, "rimanente", kw_rimanenti)
        
        // aggiorno kw rimanenti per lo slot
        await producerController.editSlot(req.body.id, req.body.slot, "rimanente", (slot_rimanente - req.body.kw))

        // aggiorno credito consumer
        await consumerController.editConsumerCredit(req.user.id, consumer.credito - (req.body.kw*slot_costo))
        
        // crea la transazione a db
        await this.createTransaction(consumer, producer, req, slot_costo, today, tomorrow);

        return [200, "OK: Transazione tra [producer " + producer.id_producer + "] e [consumer "+ consumer.id_consumer + "] registrata con successo."]

    }

    async editSlot(req){

        /*

        {
            "id": 1,    // id producer
            "slot": 15, // numero dello slot da editare
            "kw": 0     // quantitativo di kw da modificare --> se 0 si "cancella" la richiesta (controllare data)
        }

        */
        
        let result_p = await producerController.getProducerById(req.body.id);
        let producer = result_p[1];
    
        let result_c = await consumerController.getConsumerById(req.user.id);
        let consumer = result_c[1];

        let result_t = await this.getTransaction(req.body.id, req.user.id, req.body.slot)
        let transaction = result_t[1]


        let date_2 = new Date(transaction.data_prenotazione_transazione)
        let date_1 = new Date()

        if(req.body.kw == 0){
            
            // caso testato e funzionante
            if(this.diff_hours(date_2, date_1) < 24)
            {
                // se non ci sono almeno 24 ore:

                let valore_slot = await producerController.getSlotValue(req.body.id, req.body.slot, "rimanente")
                let valore_aggiornato = valore_slot[1] + transaction.kw_acquistati
                
                await producerController.editSlot(req.body.id, req.body.slot, "rimanente", valore_aggiornato) // si restituiscono i kw allo slot del producer
                await this.editTransactionFields(transaction, "emissioni_co2_slot", 0) // si azzerano le emissioni della transazione
                await this.editTransactionFields(transaction, "kw_acquistati", 0) // si azzerano i kw acquistati della transazione

                return [200, "OK: transazione da [consumer " + req.user.id + "] verso [ producer " + req.body.id + "] annullata. Emissioni e kw della transazione azzerati, kw restituiti al producer, credito NON restituto al consumer (tempo < 24 ore)"]

            }

            // caso testato e funzionante
            if(this.diff_hours(date_2, date_1) >= 24) {

                // se ci sono almeno 24 ore: 
                let valore_slot = await producerController.getSlotValue(req.body.id, req.body.slot, "rimanente")
                let valore_aggiornato = valore_slot[1] + transaction.kw_acquistati
                
                await producerController.editSlot(req.body.id, req.body.slot, "rimanente", valore_aggiornato) // si restituiscono i kw allo slot del producer
                await consumerController.editConsumerCredit(req.user.id, (consumer.credito + transaction.costo_slot)) // si riassegna il credito al consumer
                await this.delete(transaction.id_transazione) // si cancella la transazione

                return [200, "OK: transazione da [consumer " + req.user.id + "] verso [ producer " + req.body.id + "] annullata. Transazione cancellata dal db, kw restituiti al producer, credito restituto al consumer (tempo >= 24 ore)"]

            }

        } // fine caso kw richiesti = 0 --> body.kw == 0


        // caso kw > 0 con un acquisto di slot già prenotato
        
        if(req.body.kw > 0){

            if(transaction.kw_acquistati == req.body.kw) return [400, "WARNING: richiesta ignorata, [kw " + req.body.kw + "] gia' assegnati a [consumer " + req.user.id + "] per lo [slot " + req.body.slot +"]."]

            //controllare se esiste già una transazione per lo slot con lo stesso id_producer e id_consumer
            if(this.diff_hours(date_2, date_1) >= 24)
            {
                // se ci sono almeno 24 ore: 
                let valore_slot = await producerController.getSlotValue(req.body.id, req.body.slot, "rimanente")
                let valore_aggiornato = valore_slot[1] + transaction.kw_acquistati
                
                await producerController.editSlot(req.body.id, req.body.slot, "rimanente", valore_aggiornato) // si restituiscono i kw allo slot del producer
                await consumerController.editConsumerCredit(req.user.id, (consumer.credito + transaction.costo_slot)) // si riassegna il credito al consumer
                await this.delete(transaction.id_transazione) // si cancella la transazione

                //si crea una nuova transazione con i nuovi kw
                await this.reserveSlot(req)
                return [200, "OK: Transazione tra [producer " + producer.id_producer + "] e [consumer "+ consumer.id_consumer + "] modificata con successo."]

            }else return [500, "ERRORE: la transazione non può essere modificata prima delle 24 ore"]

        }
        
        /// rimuovi
        return [500, "ERRORE: hai beccato il caso base"]

    }

    async balanceSlotRequests(req, slot_totale, slot_rimanente, slot_costo, emissioni_co2, consumer, producer, today, tomorrow){

        /*
        1) "X" fa una richiesta che supera la capacità rimanente del produttore
        2) si tiene in memoria la richiesta di "X"
        3) la richiesta in kw di "X" viene sommata a tutti i kw acquistati delle transazioni all'interno dello stesso slot richiesto
        4) la somma corrisponde al tetto teorico necessario per soddisfare tutti -> y = tetto_massimo_teorico
        5) si fa il map(z, 0, y, 0, tetto_massimo) dove z è il valore in kw acquistato da ogni consumer interno allo slot + la richiesta di x
        6) si assegnano i nuovi kw ai consumer

         esempio
         200 + 400 + 500 = 1100
        per i consumer le cui transazioni sono già all'interno dello slot richiesto
        let consumer_1 = createRemap(kw_acquistati, 0, tetteo_teorico, 0, tetto_massimo); //-> editSlot mmm
        let consumer_2 = createRemap(kw_acquistati, 0, tetteo_teorico, 0, tetto_massimo); //-> editSlot mmm

        per la nuova richiesta di "X"
        let X_consumer = createRemap(kw_richiesti, 0, tetteo_teorico, 0, tetto_massimo);  //-> reserveSlot mmm
        */


        slot_rimanente = slot_totale; // reset del rimanente 

        const all_slot_transactions = await db_transazioni.findAll({where: {id_producer: req.body.id, slot_selezionato: req.body.slot}}); // trovo tutte le richieste per uno specifico slot
        let tetto_massimo_teorico = req.body.kw; // inizializzo il tetto massimo teorico con il valore della richiesta attuale

        // trovo il tetto massimo teorico
        all_slot_transactions.forEach(transaction => {
            tetto_massimo_teorico += transaction.costo_slot;
        });

        console.log("tetto massimo teorico: ", tetto_massimo_teorico)

        // bilancio tutte le richieste esistenti per lo slot
        all_slot_transactions.forEach(transaction => {

            // bilancio la richiesta
            let kw_acquistati_bilanciati = Math.trunc(this.remap_requests(transaction.kw_acquistati, 0, tetto_massimo_teorico, 0, slot_totale))

            // edito la richiesta
            this.editTransactionFields(transaction, "emissioni_co2_slot", Math.trunc(kw_acquistati_bilanciati * emissioni_co2))
            this.editTransactionFields(transaction, "costo_slot", Math.trunc(kw_acquistati_bilanciati * slot_costo))
            this.editTransactionFields(transaction, "kw_acquistati", Math.trunc(kw_acquistati_bilanciati))

            console.log("id transazione: ", transaction.id_transazione, "emissioni: ", Math.trunc(kw_acquistati_bilanciati * emissioni_co2))
            console.log("id transazione: ", transaction.id_transazione, "costo_slot: ", Math.trunc(kw_acquistati_bilanciati * slot_costo))
            console.log("id transazione: ", transaction.id_transazione, "kw_acquistati: ", Math.trunc(kw_acquistati_bilanciati))

            slot_rimanente -= kw_acquistati_bilanciati;
            console.log("slot rimanente for each: ", slot_rimanente)


        });

        // bilancio la nuova richiesta che ha provocato il taglio
        let kw_extra = this.remap_requests(req.body.kw, 0, tetto_massimo_teorico, 0, slot_totale)

        console.log("kw richiesta originali: ", req.body.kw)
        console.log("kw richiesta bilanciati: ", kw_extra)

        // effettuo una nuova transazione con la richiesta bilanciata
        req.body.kw = kw_extra
        console.log("kw richiesta bilanciati dopo assegnamento a req.body: ", req.body.kw)

        await producerController.editSlot(req.body.id, req.body.slot, "rimanente", (slot_rimanente - req.body.kw))
        console.log("slot rimanente: ", (slot_rimanente))
        console.log("slot rimanente - req.body.kw: ", (slot_rimanente - req.body.kw))

        await consumerController.editConsumerCredit(req.user.id, consumer.credito -  Math.trunc((req.body.kw*slot_costo)))
        console.log("nuovo credito: ", Math.trunc((req.body.kw*slot_costo)))

        await this.createTransaction(consumer, producer, req, slot_costo, today, tomorrow);
        console.log("transazione creata")

        //return await this.reserveSlot(req)

    }

    diff_hours(dt2, dt1) {

    //funzione per calcolare la differenza di ore tra 2 date
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.round(Math.abs(diff));

    }

    remap_requests(x, inMin, inMax, outMin, outMax) {

        return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        
    }

}





module.exports = slotController;