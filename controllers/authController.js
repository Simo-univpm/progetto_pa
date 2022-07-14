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
        // i campi richiesti per il login sono: privilegi, email, passwd

        // verifica utente registrato
        let user;
        if(body.privilegi == 0) user = await db_admins.findOne({where: {email: body.email}});
        if(body.privilegi == 1) user = await db_producers.findOne({where: {email: body.email}});
        if(body.privilegi == 2) user = await db_consumers.findOne({where: {email: body.email}});
        if( ! user) return [400, 'wrong username or password'];

        // CONTROLO PASSWORD: compara la pw nel body con quella cripatata nel db tramite bcrypt
        const validPass = await bcrypt.compare(body.passwd, user.passwd);
        if( ! validPass) return [400, 'wrong username or password'];

        let id;
        if(user.privilegi == 0) id = user.id_admin;
        if(user.privilegi == 1) id = user.id_producer;
        if(user.privilegi == 2) id = user.id_consumer;

        // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può accedere alle rotte private (e a quelle pubbliche)
        const token = jwt.sign({ id: id, privilegi: user.privilegi, nome: user.nome, email: user.email }, process.env.TOKEN_SECRET);

        return [200, token];

    }

    async registerProducer(body){

        // controlla se l'utente è registrato
        const existing_producer = await db_producers.findOne({where: { email: body.email }});
        if(existing_producer) return [500, "producer is already registered"]

        // controlla se la tipologia di fonte è ammessa
        if(! ["fossile", "eolico", "fotovoltaico"].includes(body.fonte_produzione)) return [400, "ERROR: bad request"];

        const producer = await buildProducer(body) // costruisco oggetto producer in base al body della richiesta

        try{
            const temp = await db_producers.create(producer); // scrivo producer a db
            return [200, "SUCCESS: producer with id " + temp.id_producer + " correctly created"]
        }catch(err){
            console.log(err)
            return [500, "ERROR: something went wrong " + err]
        }

    }

    async registerConsumer(body){
        
        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const consumer = await db_consumers.findOne({where: { email: body.email }});
        if(consumer) return [500, "consumer is already registered"]

        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(body.passwd, salt); // hashing pw with salt

        const data = String(new Date().toLocaleString());

        try{

            // scrittura consumer a db
            const savedConsumer = await db_consumers.create({

                nome: body.nome,
                email: body.email,
                passwd: hashed_passwd,
                credito: body.credito,
                privilegi: 2,
                data_registrazione: data

            });

            return [200, "SUCCESS: consumer with id " + savedConsumer.id_consumer + " correctly created"]
        
        }catch(err){
            console.log("CONSOLE_LOG: " + err)
            return [500, "ERROR: something went wrong"]
        }

    }

    async registerAdmin(body){

        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const admin = await db_admins.findOne({where: { email: body.email }});
        if(admin) return [500, "consumer is already registered"]

        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashed_passwd  = await bcrypt.hash(body.passwd, salt); // hashing pw with salt

        const data = String(new Date().toLocaleString());

        try{

            // scrittura admin a db
            const savedAdmin = await db_admins.create({

                nome: body.nome,
                email: body.email,
                passwd: hashed_passwd,
                privilegi: 0,
                data_registrazione: data

            });

            return [200, "SUCCESS: admin with id " + savedAdmin.id_admin + " correctly created"]
        
        }catch(err){
            console.log("CONSOLE_LOG: " + err)
            return [500, "ERROR: something went wrong"]
        }

    }

}



async function buildProducer(body){

    let producer = {}

    // impostazione dati generali

    // PASSWORD HASHING: tramite hash + salt
    const salt = await bcrypt.genSalt(10);
    const hashed_passwd  = await bcrypt.hash(body.passwd, salt); // hashing pw with salt

    let costo_per_kwh = body.costo_per_kwh;
    if( ! costo_per_kwh) costo_per_kwh = 0.0;

    let emissioni_co2 = body.emissioni_co2;
    if( ! emissioni_co2) emissioni_co2 = 0.0;

    const data = String(new Date().toLocaleString());

    producer.nome = body.nome;
    producer.codice_fiscale = body.codice_fiscale;
    producer.email = body.email;
    producer.passwd = hashed_passwd;
    producer.fonte_produzione = body.fonte_produzione;
    producer.costo_per_kwh = costo_per_kwh;
    producer.emissioni_co2 = emissioni_co2;
    producer.privilegi = 1;

    // impostazione slots
    for(i = 0; i < 24; i++){
        let app_str = "slot_" + String(i)
        producer[app_str] = body.tetto_max_kwh_init
    }

    producer.data_registrazione = data;
    
    return producer

}





module.exports = authController;