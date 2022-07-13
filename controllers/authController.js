// gestisce i login e le registrazioni per produttore, consumatore, admin
// >>>>> sarebbe fico implementarlo con un pattern factory <<<<<

const db_producers = require('../model/producer').producer;
const db_consumers = require('../model/consumer').consumer;
const db_admins = require('../model/admin').admin;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class authController {

    constructor(){}

    async login(body){

        // i campi in comune tra le 3 tabelle sono: id, nome, email, privilegi,

        // verifica utente registrato
        let user;
        if(body.privilegi == 0) user = await db_admins.findOne({nome: body.nome});
        if(body.privilegi == 1) user = await db_producers.findOne({nome: body.nome});
        if(body.privilegi == 2) user = await db_consumers.findOne({nome: body.nome});
        if( ! user) return [400, 'wrong username or password'];

        // CONTROLO PASSWORD: compara la pw nel body con quella cripatata nel db tramite bcrypt
        const validPass = await bcrypt.compare(body.passwd, user.passwd);
        if( ! validPass) return [400, 'wrong username or password'];

        let id;
        if(user.privilegi == 0) id = user.id_admin;
        if(user.privilegi == 1) id = user.id_producer;
        if(user.privilegi == 2) id = user.id_consumer;

        // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può accedere alle rotte private (e a quelle pubbliche)
        const token = jwt.sign({ id: id, privilegi: user.privilegi, nome: user.nome, emai: user.email }, process.env.TOKEN_SECRET);

        return [200, token];

    }

    async registerProducer(body){

        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const producer = await db_producers.findOne({where: { mail: body.mail }});
        if(producer) return [500, "producer is already registered"]

        // controllo tipologia fonte
        let fonte = body.fonte.toLowerCase();
        if(! ["fossile", "eolico", "fotovoltaico"].includes(fonte)) return [400, "ERROR: bad request"];

        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(body.passwd, salt); // hashing pw with salt

        let costo_per_kwh = body.costo_per_kwh;
        if( ! costo_per_kwh) costo_per_kwh = 0.0;

        let emissioni_co2 = body.emissioni_co2;
        if( ! emissioni_co2) emissioni_co2 = 0.0;        

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

    /// DA RIMUOVERE
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

    /// DA RIMUOVERE
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