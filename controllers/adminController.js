//gestisce le operazioni dell'admin
const DButenti = require('../model/utente').utente; // corrisponde a database.utente.findAll

class adminController {

    constructor(){}
    
    async test_get(){

        try{
            const utenti = await DButenti.findAll();
            return [200, utenti]
        }catch(err){
            return[500, err]
        }

    }

    async addCredit(body){}

}


module.exports = adminController;