const db_consumers = require('../model/consumer').consumer;
const bcrypt = require('bcryptjs');

class consumerController {

    constructor(){}

    // CRUD =================================================
    async getConsumer(req){

        //nel body serve: id

        const id = req.body.id

        try{

           const consumer = await db_consumers.findOne({where: { id_consumer: id }});
           if( ! consumer) return [404, "consumer not found"]

           return [200, consumer]

        }catch(err){
            return [500, "something went wrong " + err]
        }

    }

    async getConsumerById(id){

        // per gettare il consumer tramite l'id del token invece del body della request

        try{

           const consumer = await db_consumers.findOne({where: { id_consumer: id }});
           if( ! consumer) return [404, "consumer not found"]

           return [200, consumer]

        }catch(err){
            return [500, "something went wrong " + err]
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
                credito: data.credito,
                privilegi: 2,
                data_registrazione: data_registrazione

            });

            return [200, "SUCCESS: consumer with id " + consumer.id_consumer + " created"]
        
        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async editConsumerCredit(id, credito){

        // nel body servono: id, credito

        try{

            if(credito < 0) return [400, "ERRORE: il credito non puo' essere inferiore di 0"]

            let result = await this.getConsumerById(id)
            result[1].update({credito: credito})

            return [200, "SUCCESS: credit updated"]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async decreaseConsumerCredit(id, nuovo_credito){

        try{
            let result_c = await this.getConsumerById(id);
            let consumer = result_c[1]

            if(nuovo_credito > consumer.credito) return [500, "ERROR: nuovo credito superiore all'attuale"]
            
            consumer.update({credito: nuovo_credito})
            return [200, "SUCCESS: credit updated"]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }


    }

    async delete(req){

        // nel body serve: id

        let id  = req.body.id;

        try{

            await db_consumers.destroy({ where: { id_consumer: id } });
            return [200, "SUCCESS: deleted consumer with id: " + id]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    // consegna ==============================================
    async getPurchaseList(time_period){}

    async getEmissions(time_period){}

}


module.exports = consumerController;