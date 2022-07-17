const db_admins = require('../model/admin').admin;
const bcrypt = require('bcryptjs');

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

class adminController {

    constructor(){}

    // CRUD =================================================
    async getAdmin(req){

        //nel body serve: id

        const id = req.body.id

        try{

            const admin = await db_admins.findOne({where: { id_admin: id }});
            if( ! admin) return [404, "ERRORE: [admin " + id + "] non trovato."]

            return [200, admin]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async createAdmin(req){

        //nel body servono: nome, email, passwd
        const data = req.body

        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(data.passwd, salt); // hashing pw with salt

        const data_registrazione = new Date();

        try{

            // scrittura admin a db
            const savedAdmin = await db_admins.create({

                nome: data.nome,
                email: data.email,
                passwd: hashed_passwd,
                privilegi: 0,
                data_registrazione: data_registrazione

            });

            return [200, "OK: [admin " + savedAdmin.id_admin + "] creato."]
        
        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    async delete(req){

        // nel body serve: id

        let id  = req.body.id;

        try{

            await db_admins.destroy({ where: { id_admin: id } });
            return [200, "OK: [admin " + id + "] eliminato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

    }

    // consegna =============================================
    async ricarica(req){

        return await consumerController.editConsumerCredit(req.body.id, req.body.credito);

    }

}


module.exports = adminController;