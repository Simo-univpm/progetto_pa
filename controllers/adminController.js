const db_admins = require('../model/admin').admin;
const bcrypt = require('bcryptjs');

class adminController {

    constructor(){}

    // CRUD =================================================
    async getAdmin(req){

        //nel body serve: id

        const id = req.body.id

        try{

            const admin = await db_admins.findOne({where: { id_admin: id }});
            if( ! admin) return [404, "admin not found"]

            return [200, admin]

        }catch(err){
            return [500, "something went wrong " + err]
        }

    }

    async createAdmin(req){

        //nel body servono: nome, email, passwd
        const data = req.body

        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(data.passwd, salt); // hashing pw with salt

        const data_registrazione = String(new Date().toLocaleString());

        try{

            // scrittura admin a db
            const savedAdmin = await db_admins.create({

                nome: data.nome,
                email: data.email,
                passwd: hashed_passwd,
                privilegi: 0,
                data_registrazione: data_registrazione

            });

            return [200, "SUCCESS: admin with id " + savedAdmin.id_admin + " correctly created"]
        
        }catch(err){
            console.log("CONSOLE_LOG: " + err)
            return [500, "ERROR: something went wrong"]
        }

    }

    async delete(req){

        // nel body serve: id

        let id  = req.body.id;

        try{

            await db_admins.destroy({ where: { id_admin: id } });
            return [200, "SUCCESS: deleted admin with id: " + id]

        }catch(err){
            return [500, "ERROR: something went wrong " + err]
        }

    }

    // consegna =============================================
    async addCredit(body){}

}


module.exports = adminController;