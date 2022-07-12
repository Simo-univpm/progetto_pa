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
        const utente = await db_producers.findOne({where: { email: body.email }});
        if(utente) return [500, "producer is already registered"]

        // cripta pw
        hashed_pw = body.pw

        try{
            // scrittura prodicer a db
            const savedProducer = await db_producers.create({

                //prodotto: datiProdotto.id_prodotto,
                passwd: hashed_pw,
                mail: body.mail,
                ruolo: body.ruolo,
                fonte: body.fonte,
                costo_per_kwh: 0, // imposta da altra api
                emissioni_co2: 0, // imposta da altra api
                credito: body.credito

            });

            return [200, "SUCCESS: producer with id " + savedProducer.idProducer + " correctly created"]

        }catch(err){
            return [500, "ERROR: something went wrong"]
        }
        
        

    }

    async registerConsumer(body){}

}


module.exports = authController;