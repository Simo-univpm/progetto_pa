const db_consumers = require('../model/consumer').consumer;
const bcrypt = require('bcryptjs');

class consumerController {

    constructor(){}

    // CRUD =================================================
    async getConsumer(id){

        try{

           const consumer = await db_consumers.findOne({where: { id_consumer: id }});
           if( ! consumer) return [404, "ERRORE: [consumer " + id + "] non trovato."]

           return [200, consumer]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async createConsumer(data){

        //nel body servono: nome, email, passwd, credito, privilegi, data_registrazione

        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(data.passwd, salt); // hashing pw with salt

        const data_registrazione = new Date();

        try{

            // scrittura consumer a db
            const consumer = await db_consumers.create({

                nome: data.nome,
                email: data.email,
                passwd: hashed_passwd,
                credito: data.credito,
                privilegi: 2,
                data_registrazione: data_registrazione

            });

            return [200, "OK: [consumer " + consumer.id_consumer + "] creato."]
        
        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async editConsumerCredit(id, credito){

        try{
            let result_c = await this.getConsumer(id);
            let consumer = result_c[1]

            if(credito <= 0) return [500, "ERRORE: inserire un credito valido"]
            
            consumer.update({credito: credito})
            return [200, "OK: credito di [consumer " + id + "] aggiornato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }


    }

    async delete(id){

        try{

            await db_consumers.destroy({ where: { id_consumer: id } });
            return [200, "OK: [consumer " + id + "] eliminato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    // consegna ==============================================
    async getPurchaseList(time_period){}

    async getEmissions(time_period){}

}


module.exports = consumerController;