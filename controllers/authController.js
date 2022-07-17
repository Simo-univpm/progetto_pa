// gestisce i login e le registrazioni per produttore, consumatore, admin
const db_producers = require('../model/producer').producer;
const db_consumers = require('../model/consumer').consumer;
const db_admins = require('../model/admin').admin;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();

const AdminController = require('../controllers/adminController');
const adminController = new AdminController();

class authController {

    constructor(){}

    async login(data){

        // i campi in comune tra le 3 tabelle sono: id, nome, email, privilegi,
        // i campi richiesti per il login sono: privilegi, email, passwd

        // verifica utente registrato
        let user;
        if(data.privilegi == 0) user = await db_admins.findOne({where: {email: data.email}});
        if(data.privilegi == 1) user = await db_producers.findOne({where: {email: data.email}});
        if(data.privilegi == 2) user = await db_consumers.findOne({where: {email: data.email}});
        if( ! user) return [400, 'ERRORE: username o password errati.'];

        // CONTROLO PASSWORD: compara la pw nel body con quella cripatata nel db tramite bcrypt
        const validPass = await bcrypt.compare(data.passwd, user.passwd);
        if( ! validPass) return [400, 'ERRORE: username o password errati.'];

        let id;
        if(user.privilegi == 0) id = user.id_admin;
        if(user.privilegi == 1) id = user.id_producer;
        if(user.privilegi == 2) id = user.id_consumer;

        // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può accedere alle rotte private (e a quelle pubbliche)
        const token = jwt.sign({ id: id, privilegi: user.privilegi, nome: user.nome, email: user.email }, process.env.TOKEN_SECRET);

        return [200, token];

    }

    async registerProducer(data){

        // controlla se la mail del producer è già registrata
        const producer = await db_producers.findOne({where: { email: data.email }});
        if(producer) return [500, "ERRORE: [producer " + producer.id_producer + "] e' gia' registrato."]

        // controlla se la tipologia di fonte è ammessa
        if(! ["fossile", "eolico", "fotovoltaico"].includes(data.fonte_produzione)) return [400, "ERRORE: fonte specificata non ammessa."];

        return await producerController.createProducer(data);

    }

    async registerConsumer(data){
        
        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const consumer = await db_consumers.findOne({where: { email: data.email }});
        if(consumer) return [500, "ERRORE: [consumer " + consumer.id_consumer + "] e' gia' registrato."]

        return await consumerController.createConsumer(data)

    }

    async registerAdmin(data){

        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const admin = await db_admins.findOne({where: { email: data.email }});
        if(admin) return [500, "ERRORE: [admin " + admin.id_admin + "] e' gia' registrato."]

        return await adminController.createAdmin(data);

    }

}


module.exports = authController;