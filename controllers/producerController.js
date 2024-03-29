const db_transazioni = require('../model/transazioni').transazioni;
const db_producers = require('../model/producer').producer;
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');


class producerController {

    constructor(){}

    async getProducer(req){

        //nel body serve: id

        const id = req.body.id

        try{

           const producer = await db_producers.findOne({where: { id_producer: id }});
           if( ! producer) return [404, "ERRORE: [producer " + id + "] non trovato."]

           return [200, producer]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async getProducerById(id){

        try{

           const producer = await db_producers.findOne({where: { id_producer: id }});
           if( ! producer) return [404, "ERRORE: [producer " + id + "] non trovato."]

           return [200, producer]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async createProducer(req){

        //nel body servono: nome, codice_fiscale, email, passwd, fonte_produzione, costo_per_kwh, emissioni_co2, tetto_max_kwh_init
        
        const temp = await this.buildProducer(req.body) // costruisco oggetto producer in base al body della richiesta

        try{
            const producer = await db_producers.create(temp); // scrivo producer a db
            return [200, "OK: [producer " + producer.id_producer + "] creato."]
        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async buildProducer(data){

        let producer = {}
    
        // impostazione dati generali
    
        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(data.passwd, salt); // hashing pw with salt
    
        let costo_per_kwh = data.costo_per_kwh;
        if( ! costo_per_kwh) costo_per_kwh = 0.0;
    
        let emissioni_co2 = data.emissioni_co2;
        if( ! emissioni_co2) emissioni_co2 = 0.0;
    
        const data_registrazione = new Date();
    
        producer.nome = data.nome;
        //producer.codice_fiscale = data.codice_fiscale;
        producer.email = data.email;
        producer.passwd = hashed_passwd;
        producer.fonte_produzione = data.fonte_produzione;
        producer.emissioni_co2 = emissioni_co2;
        producer.privilegi = 1;
    
        // impostazione slots
        const default_slot = JSON.stringify({"costo": data.costo.toFixed(2), "totale": data.tetto_max_kwh_init.toFixed(2), "rimanente": data.tetto_max_kwh_init.toFixed(2)});
    
        for(let i = 0; i < 24; i++){
            let app_str = "slot_" + String(i);
            producer[app_str] = default_slot;
        }
    
        producer.data_registrazione = data_registrazione;
        producer.accetta_taglio_richieste = data.taglio;
        
        return producer
    
    }

    async editSlot(id_producer, slot_number, campo, valore){

        let slot_to_edit = "slot_" + slot_number

        if(valore < 0) return [500, "ERRORE: inserire un valore positivo"]

        try{

            let result_p = await this.getProducerById(id_producer);
            let producer = result_p[1];

            let slot = producer[slot_to_edit]
            slot = JSON.parse(slot)

            if(campo === "costo") slot.costo = valore.toFixed(2)
            else if(campo === "totale") slot.totale = valore.toFixed(2)
            else if(campo === "rimanente") slot.rimanente = valore.toFixed(2)
            else return [404, "ERRORE: campo non esistente"]

            slot = JSON.stringify(slot)

            producer.update({[slot_to_edit]: slot})
            return [200, "OK: [" + slot_to_edit + "] di [producer " + producer.id_producer + "] aggiornato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async getSlotValue(id_producer, slot_number, campo){

        let slot_to_read = "slot_" + slot_number;

        try{

            let result_p = await this.getProducerById(id_producer);
            let producer = result_p[1];
            
            let slot = producer[slot_to_read]
            slot = JSON.parse(slot)

            if(campo === "costo") return [200, parseFloat(slot.costo)]
            else if(campo === "totale") return [200, parseFloat(slot.totale)]
            else if(campo === "rimanente")return [200, parseFloat(slot.rimanente)]
            else return [404, "ERRORE: campo non esistente"]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async getMultipleSlots(id_producer, slot_inizio, slot_fine){
    
        let result_p = await this.getProducerById(id_producer)
        let producer = result_p[1]

        let selected_slots = []

        try{

            for(let i = slot_inizio; i <= slot_fine; i ++){

                let slot_to_read = "slot_" + i;

                let slot = producer[slot_to_read]
                selected_slots.push(JSON.parse(slot))

            }

            return selected_slots

        }catch(err){
            return err
        }

    }

    async delete(req){

        // nel body serve: id

        let id  = req.body.id;

        try{

            await db_producers.destroy({ where: { id_producer: id } });
            return [200, "OK: [producer " + id + "] eliminato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async checkReservations(id_producer, slot_inizio, slot_fine){

        if((slot_inizio < 0) || (slot_inizio > 23)) return [400, "ERRORE: periodo selezionato non valido."]
        if((slot_fine < 0) || (slot_fine > 23)) return [400, "ERRORE: periodo selezionato non valido."]

        // ottengo gli slot interessati ed estrapolo i valori totali e rimanenti mettendoli in due array separati
        let totale = await this.getMultipleSlots(id_producer, slot_inizio, slot_fine)
        let rimanente = JSON.parse(JSON.stringify(totale)) // deep copy
        
        totale = totale.map(x => x.totale)
        rimanente = rimanente.map(x => x.rimanente)

        // creo array con tutti i kw erogati dal produttore nel periodo considerato
        let kw_erogati = [];
        for(let i = 0; i < totale.length; i ++) kw_erogati.push(totale[i] - rimanente[i]);

        // calcolo della percentuale di energia erogata nel periodo considerato
        const percentuali_occupazione = this.calcola_percentuale(kw_erogati, totale);

        // costruisco un array contenente il nome dello slot interessato e la percentuale di energia erogata
        let array_slot_percentuali = [];
        for (let i = slot_inizio; i <= slot_fine; i++){

            let app_obj = {}
            let app_str = "slot_" + String(i);

            app_obj[app_str] = percentuali_occupazione[i-slot_inizio];
            array_slot_percentuali.push(app_obj)

        }

        return [200, array_slot_percentuali];

    }

    async checkStats(id_producer, inizio, fine){

        try{

            var transazioni = await db_transazioni.findAll({ where: {id_producer: id_producer, "data_prenotazione_transazione": {[Op.between] : [new Date(inizio) , new Date(fine)]}}});
            if(transazioni.length == 0) return [404, "ERRORE: transazioni non trovate per [producer " + id_producer + "] per il range di date selezionato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

        let kw_erogati_per_slot = [];
        let lista_slot_analizzati = [];

        // trovo i kw erogati per ogni slot
        for(let i = 0; i < transazioni.length; i++){

            let slot_corrente = transazioni[i].slot_selezionato;

            // controllo se ho già analizzato le vendite per lo slot corrente
            if( ! lista_slot_analizzati.includes(slot_corrente)) { 

                lista_slot_analizzati.push(slot_corrente)

                var app_slot = {
                    "slot_selezionato": slot_corrente,
                    "kw_acquistati": transazioni[i].kw_acquistati,
                    "kw_massimo": transazioni[i].kw_massimo,
                    "data_prenotazione_transazione": transazioni[i].data_prenotazione_transazione
                }

            } else continue; // se le ho analizzate salto l'iterazione
            
            // altrimenti si sommano tra di loro i kw acquistati di tutte le transazioni per lo stesso slot
            for(let k = i+1; k < transazioni.length; k++){

                if(transazioni[k].slot_selezionato == slot_corrente) {
                    app_slot.kw_acquistati += transazioni[k].kw_acquistati
                }

            }

            kw_erogati_per_slot.push(app_slot);

        }


        let statistiche_slots = [];
        kw_erogati_per_slot.forEach(slot => {
            
            let app_obj = {}
            app_obj["slot"] = slot.slot_selezionato
            app_obj["%_min"] = ((slot.kw_acquistati/slot.kw_massimo) * 100)
            app_obj["%_max"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // aggiornare calcoli
            app_obj["%_med"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // aggiornare calcoli
            app_obj["dev_std"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // aggiornare calcoli

            statistiche_slots.push(app_obj)

        });

        return [200, statistiche_slots]

    }

    async checkEarnings(id_producer, inizio, fine){
        
    /*
    trova i guadagni per il produttore loggato nel range temporale specificato
        {
            "inizio": "2022-07-20 05:00",
            "fine": "2022-07-20 05:00"
        }
        
    */

        try{

            var transazioni = await db_transazioni.findAll({ where: {id_producer: id_producer, "data_prenotazione_transazione": {[Op.between] : [new Date(inizio) , new Date(fine)]}}});
            if( ! transazioni) return [404, "ERRORE: transazioni non trovate per [producer " + id_producer + "] per il range di date selezionato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

        let guadagno = 0;
        transazioni.forEach(transazione => {
            guadagno += transazione.costo_slot;
        });

        return [200, guadagno]

    }

    //funzione che calcola la percentuale tra i due array di rimanente e totale e li inserisce in un array
    calcola_percentuale(array_rimanente, array_totale) {

        let array_percentuale = [];
        
        for (let i = 0; i < array_rimanente.length; i++) {

            array_percentuale.push(this.createRemap(array_rimanente[i], 0, array_totale[i], 0, 100))    //array_rimanente[i] / array_totale[i]);
            //console.log("array_rimanente[" + i + "] " + array_rimanente[i], "array_totale[" + i + "] " + array_totale[i], "array_percentuale[" + i + "] " + array_percentuale[i] + "%")

        }
        return array_percentuale;
    }

    createRemap(x, inMin, inMax, outMin, outMax) {

        return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        
    }

}


module.exports = producerController;