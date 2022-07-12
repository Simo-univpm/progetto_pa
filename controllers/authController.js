// gestisce i login e le registrazioni per produttore, consumatore, admin
// >>>>> sarebbe fico implementarlo con un pattern factory <<<<<

const db_producers = require('../model/producer').producer;
const db_consumers = require('../model/consumer').consumer;
const db_admins = require('../model/admin').admin;

class authController {

    constructor(){}

    async login(body){}

    // factory per la registrazione degli utenti
    async registerProducer(body){

        // lettura
        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const producer = await db_producers.findOne({where: { mail: body.mail }});
        if(producer) return [500, "producer is already registered"]

        // TODO: cripta pw
        const hashed_passwd = body.passwd

        try{
            // scrittura producer a db
            const savedProducer = await db_producers.create({

                passwd: hashed_passwd,
                mail: body.mail,
                fonte: body.fonte

            });

            return [200, "SUCCESS: producer with id " + savedProducer.idProducer + " correctly created"]

        }catch(err){
            return [500, "ERROR: something went wrong"]
        }
        
        

    }

    async registerConsumer(body){}

    async registerAdmin(body){}

}


module.exports = authController;