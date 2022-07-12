//gestisce le operazioni dell'admin
const db_consumers = require('../model/consumer').consumer; // corrisponde a database.utente.findAll

class adminController {

    constructor(){}
    
    async test_get(){

        try{
            const consumers = await db_consumers.findAll();
            return [200, consumers]
        }catch(err){
            return[500, err]
        }

    }

    async addCredit(body){}

}


module.exports = adminController;