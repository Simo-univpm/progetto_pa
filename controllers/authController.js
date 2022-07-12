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

        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const producer = await db_producers.findOne({where: { mail: body.mail }});
        if(producer) return [500, "producer is already registered"]

        // TODO: cripta pw
        const hashed_passwd = body.passwd

        let costo_per_kwh = body.costo_per_kwh;
        if( ! costo_per_kwh) costo_per_kwh = 0.0;

        let emissioni_co2 = body.emissioni_co2;
        if( ! emissioni_co2) emissioni_co2 = 0.0;

        // controllo tipologia fonte
        let fonte = body.fonte.toLowerCase();
        if(! ["fossile", "eolico", "fotovoltaico"].includes(fonte)) return [400, "ERROR: bad request"];

        let 
        

        try{

            // scrittura producer a db
            const savedProducer = await db_producers.create({

                passwd: hashed_passwd,
                mail: body.mail,
                fonte: fonte,
                ruolo: "producer",
                costo_per_kwh: costo_per_kwh,
                emissioni_co2: costo_per_kwh,
                //tettoperslotjsondiocane

            });

            return [200, "SUCCESS: producer with id " + savedProducer.idProducer + " correctly created"]

        }catch(err){
            console.log(err)
            return [500, "ERROR: something went wrong"]
        }
        
        

    }

    async getProducers(){

        try{
            const producers = await db_producers.findAll();
            return [200, producers]

        }catch(err){
            return [500, "ERROR: something went wrong"]
        }

    }

    async registerConsumer(body){

        // CONTROLLO CONSUMER REGISTRATO: controlla se la mail è nel db
        //const consumer = await db_consumers.findOne({where: { mail: body.mail }});
        //if(consumer) return [500, "consumer is already registered"]

        // TODO: cripta pw
        const hashed_passwd = body.passwd
        
        try{

            // scrittura consumer a db
            const savedConsumer = await db_consumers.create({

                passwd: hashed_passwd,
                mail: body.mail,
            
                ruolo: "consumer",
                credito: 10.0

            });

            return [200, "SUCCESS: consumer with id " + savedConsumer.idConsumer + " correctly created"]

        }catch(err){
            console.log(err)
            //return [500, "ERROR: something went wrong"]
            return [500, err]
        }

    }

    async getConsumers(){

        try{
            const consumers = await db_consumers.findAll();
            return [200, consumers]

        }catch(err){
            return [500, "ERROR: something went wrong"]
        }

    }

    async registerAdmin(body){}

}


module.exports = authController;