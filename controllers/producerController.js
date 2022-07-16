const db_producers = require('../model/producer').producer;
const bcrypt = require('bcryptjs');

class producerController {

    constructor(){}

    // CRUD =================================================
    async getProducer(req){

        //nel body serve: id

        const id = req.body.id

        try{

           const producer = await db_producers.findOne({where: { id_producer: id }});
           if( ! producer) return [404, "producer not found"]

           return [200, producer]

        }catch(err){
            return [500, "something went wrong " + err]
        }

    }

    async getProducerById(id){

        try{

           const producer = await db_producers.findOne({where: { id_producer: id }});
           if( ! producer) return [404, "producer not found"]

           return [200, producer]

        }catch(err){
            return [500, "something went wrong " + err]
        }

    }

    async getProducerByName(req){

        //nel body serve: nome

        try{

           const producer = await db_producers.findOne({where: { nome: req.body.nome }});
           if( ! producer) return [404, "producer not found"]

           return [200, producer]

        }catch(err){
            return [500, "something went wrong " + err]
        }

    }

    async createProducer(req){

        //nel body servono: nome, codice_fiscale, email, passwd, fonte_produzione, costo_per_kwh, emissioni_co2, tetto_max_kwh_init
        
        const temp = await this.buildProducer(req.body) // costruisco oggetto producer in base al body della richiesta

        try{
            const producer = await db_producers.create(temp); // scrivo producer a db
            return [200, "SUCCESS: producer with id " + producer.id_producer + " correctly created"]
        }catch(err){
            console.log(err)
            return [500, "ERROR: something went wrong " + err]
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
    
        //const data_registrazione = String(new Date().toLocaleString());
        const data_registrazione = new Date().toLocaleString();
    
        producer.nome = data.nome;
        producer.codice_fiscale = data.codice_fiscale;
        producer.email = data.email;
        producer.passwd = hashed_passwd;
        producer.fonte_produzione = data.fonte_produzione;
        producer.emissioni_co2 = emissioni_co2;
        producer.privilegi = 1;
    
        // impostazione slots
        const default_slot = JSON.stringify({"costo": data.costo, "totale": data.tetto_max_kwh_init, "rimanente": data.tetto_max_kwh_init});
    
        for(let i = 0; i < 24; i++){
            let app_str = "slot_" + String(i);
            producer[app_str] = default_slot;
        }
    
        producer.data_registrazione = data_registrazione;
        
        return producer
    
    }

    async editSlotKwLimit(req){

        // nel body servono: id (del producer), slot (da editare), kw (da aggiornare)

        let slot_to_edit = "slot_" + req.body.slot // 15 --> slot_15
        let new_value = req.body.kw                // 10 kw

        try{

            let result = await this.getProducer(req)

            let slot = result[1][slot_to_edit] // prendo json da aggiornare a db, stringa
            slot = JSON.parse(slot)            // trasformo il json in oggetto --> {"totale": slot_totale, "rimanente": slot_rimanente}
            slot.totale = new_value            // aggiorno l'oggetto
            slot = JSON.stringify(slot)        // trasformo l'oggetto in stringa per scriverlo a db

            result[1].update({[slot_to_edit]: slot})
            return [200, "SUCCESS: slot updated"]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async editSlotKwRemaining(req){

        // nel body servono: id (del producer), slot (da editare), kw (da aggiornare)
        let slot_to_edit = "slot_" + req.body.slot // 15 --> slot_15
        let new_value = req.body.kw                // 10 kw

        try{

            let result = await this.getProducer(req)

            let slot = result[1][slot_to_edit] // prendo json da aggiornare a db, stringa
            slot = JSON.parse(slot)            // trasformo il json in oggetto --> {"totale": slot_totale, "rimanente": slot_rimanente}
            slot.rimanente = new_value            // aggiorno l'oggetto
            slot = JSON.stringify(slot)        // trasformo l'oggetto in stringa per scriverlo a db

            result[1].update({[slot_to_edit]: slot})
            return [200, "SUCCESS: slot updated"]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async editSlotPrice(req){

        // nel body servono: id (del producer), slot (da editare), costo (da aggiornare)

        let slot_to_edit = "slot_" + req.body.slot // 15 --> slot_15
        let new_value = req.body.costo             // 666

        try{

            let result = await this.getProducer(req)

            let slot = result[1][slot_to_edit] // prendo json da aggiornare a db, stringa
            slot = JSON.parse(slot)            // trasformo il json in oggetto --> {"totale": slot_totale, "rimanente": slot_rimanente}
            slot.costo = new_value            // aggiorno l'oggetto
            slot = JSON.stringify(slot)        // trasformo l'oggetto in stringa per scriverlo a db

            result[1].update({[slot_to_edit]: slot})
            return [200, "SUCCESS: slot updated"]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async editSlot(id_producer, slot_number, campo, valore){

        let slot_to_edit = "slot_" + slot_number

        try{

            let producer = await this.getProducerById(id_producer)

            let slot = producer[1][slot_to_edit]
            slot = JSON.parse(slot)

            if(campo === "costo") slot.costo = valore
            else if(campo === "totale") slot.totale = valore
            else if(campo === "rimanente") slot.rimanente = valore
            else if(campo === "emissioni_co2") slot.emissioni_co2 = valore
            else return [500, "ERRORE: campo non modificabile"]

            slot = JSON.stringify(slot)

            producer[1].update({[slot_to_edit]: slot})
            return [200, "SUCCESS: slot updated"]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async delete(req){

        // nel body serve: id

        let id  = req.body.id;

        try{

            await db_producers.destroy({ where: { id_producer: id } });
            return [200, "SUCCESS: deleted producer with id: " + id]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    // consegna =======================================================================
    async checkReservations(body){}

    async checkStats(body){}

    async checkEarnings(body){}

}


module.exports = producerController;



// ok edita il campo
// poi fai crud per admin
// poi fai la prenotazione dello slot usanto i crud freschi freschi
// dormi