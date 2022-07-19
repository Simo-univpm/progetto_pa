const db_transazioni = require('../model/transazioni').transazioni;const db_consumers = require('../model/consumer').consumer;
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

class consumerController {

    constructor(){}

    // CRUD =================================================
    async getConsumer(req){

        //nel body serve: id

        const id = req.body.id

        try{

           const consumer = await db_consumers.findOne({where: { id_consumer: id }});
           if( ! consumer) return [404, "ERRORE: [consumer " + id + "] non trovato."]

           return [200, consumer]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async getConsumerById(id){

        // per gettare il consumer tramite l'id del token invece del body della request

        try{

           const consumer = await db_consumers.findOne({where: { id_consumer: id }});
           if( ! consumer) return [404, "ERRORE: [consumer " + id + "] non trovato."]

           return [200, consumer]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async createConsumer(req){

        //nel body servono: nome, email, passwd, credito, privilegi, data_registrazione

        const data = req.body

        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(data.passwd, salt); // hashing pw with salt

        //const data_registrazione = String(new Date().toLocaleString());
        const data_registrazione = new Date();

        try{

            // scrittura consumer a db
            const consumer = await db_consumers.create({

                nome: data.nome,
                email: data.email,
                passwd: hashed_passwd,
                credito: data.credito.toFixed(2),
                privilegi: 2,
                data_registrazione: data_registrazione

            });

            return [200, "OK: [consumer " + consumer.id_consumer + "] creato."]
        
        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async editConsumerCredit(id, credito){

        // nel body servono: id, credito

        try{

            let result = await this.getConsumerById(id)
            result[1].update({credito: credito.toFixed(2)})

            return [200, "OK: credito di [consumer " + id + "] aggiornato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async delete(req){

        // nel body serve: id

        let id  = req.body.id;

        try{

            await db_consumers.destroy({ where: { id_consumer: id } });
            return [200, "OK: [consumer " + id + "] eliminato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    // consegna ==============================================
    async getPurchaseList(id_consumer, producer, fonte, inizio, fine){

        

    }

    async getEmissions(id_consumer, inizio, fine){

        /*
        // trova le emissioni per il consumer loggato nel range di slot indicato per tutte le transazioni effettuate
            {
                "inizio": 0,
                "fine": 18
            }

        
        // trova le emissioni per il consumer loggato nel range temporale specificato
            {
                "inizio": "2022-07-20 05:00",
                "fine": "2022-07-20 05:00"
            }
        
        */

        // caso in cui l'utente inserisce data e ora --> "2020-07-19 20:30"
        if((typeof inizio === 'string') && (typeof fine === 'string')){

            try{

                var transazioni = await db_transazioni.findAll({ where: {id_consumer: id_consumer, "data_prenotazione_transazione": {[Op.between] : [new Date(inizio) , new Date(fine)]}}});
                if( ! transazioni) return [404, "ERRORE: transazioni non trovate per [consumer " + id_consumer + "] per il range di date selezionato."]
    
            }catch(err){
                return [500, "ERRORE: qualcosa e' andato storto." + err]
            }

        } else {

            // caso in cui l'utente inserisce un range di slot 15 - 18
            if((inizio < 0) || (inizio > 23)) return [400, "ERRORE: periodo selezionato non valido."]
            if((fine < 0) || (fine > 23)) return [400, "ERRORE: periodo selezionato non valido."]

            try{

                var transazioni = await db_transazioni.findAll({ where: {id_consumer: id_consumer, "slot_selezionato": {[Op.between] : [inizio , fine]}}});
                if( ! transazioni) return [404, "ERRORE: transazioni non trovate per [consumer " + id_consumer + "] per il range di slot selezionato."]

            }catch(err){
                return [500, "ERRORE: qualcosa e' andato storto." + err]
            }

        }

        let emissioni = 0;
        transazioni.forEach(transazione => {
            emissioni += transazione.emissioni_co2_slot;
        });

        return [200, emissioni]

    }

}


module.exports = consumerController;