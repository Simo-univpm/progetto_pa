const db_admins = require('../model/admin').admin;
const bcrypt = require('bcryptjs');

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

class adminController {

    constructor(){}

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

    async ricarica(req){

        return await consumerController.editConsumerCredit(req.body.id, req.body.credito);

    }

}


module.exports = adminController;