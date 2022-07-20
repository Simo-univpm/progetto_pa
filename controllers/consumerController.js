const db_consumers = require('../model/consumer').consumer;
const db_transazioni = require('../model/transazioni').transazioni;
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');


class consumerController {

    constructor(){}

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

    async getPurchaseListProducer(id_consumer, id_producer){

        //if(typeof id_producer != 'Number') return [400, "ERRORE: inserire un id numerico."]

        try{

            // tutte le transazioni effettuate dall'utente filtrate per id_producer
            const transazioni = await db_transazioni.findAll({where: {id_consumer: id_consumer, id_producer: id_producer}});
            if((transazioni.length == 0)) return [404, "ERRORE: transazioni con [producer " + id_producer + "] per [consumer " + id_consumer + "] non trovate."]

            return [200, transazioni];

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }


    }

    async getPurchaseListFonte(id_consumer, fonte){

        try{

            // tutte le transazioni effettuate dall'utente filtrate per fonte
            const transazioni = await db_transazioni.findAll({where: {id_consumer: id_consumer, fonte_produzione: fonte}});
            if(transazioni.length == 0) return [404, "ERRORE: transazioni di energia [" + fonte + "] per [consumer " + id_consumer + "] non trovate."]

            return [200, transazioni];

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }


    }

    async getPurchaseListPeriodo(id_consumer, inizio, fine){

        try{

            // tutte le transazioni effetuate dall'utente filtrate per periodo temporale
            const transazioni = await db_transazioni.findAll({ where: {id_consumer: id_consumer, "data_prenotazione_transazione": {[Op.between] : [new Date(inizio) , new Date(fine)]}}});
            if(transazioni.length == 0) return [404, "ERRORE: transazioni per il periodo [" + inizio  + ", " + fine + "] per [consumer " + id_consumer + "] non trovate."]

            return [200, transazioni];

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }
    }

    async getEmissions(id_consumer, inizio, fine){

        /*      
        trova le emissioni per il consumer loggato nel range temporale specificato
            {
                "inizio": "2022-07-20 05:00",
                "fine": "2022-07-20 05:00"
            }
        
        */

        try{

            var transazioni = await db_transazioni.findAll({ where: {id_consumer: id_consumer, "data_prenotazione_transazione": {[Op.between] : [new Date(inizio) , new Date(fine)]}}});
            if( ! transazioni) return [404, "ERRORE: transazioni non trovate per [consumer " + id_consumer + "] per il range di date selezionato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

        let emissioni = 0;
        transazioni.forEach(transazione => {
            emissioni += transazione.emissioni_co2_slot;
        });

        return [200, emissioni]

    }

}


module.exports = consumerController;