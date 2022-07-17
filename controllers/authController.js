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

    async login(req){

        // i campi in comune tra le 3 tabelle sono: id, nome, email, privilegi,
        // i campi richiesti per il login sono: privilegi, email, passwd

        // verifica utente registrato
        let user;
        if(req.body.privilegi == 0) user = await db_admins.findOne({where: {email: req.body.email}});
        if(req.body.privilegi == 1) user = await db_producers.findOne({where: {email: req.body.email}});
        if(req.body.privilegi == 2) user = await db_consumers.findOne({where: {email: req.body.email}});
        if( ! user) return [400, 'ERRORE: username o password errati.'];

        // CONTROLO PASSWORD: compara la pw nel body con quella cripatata nel db tramite bcrypt
        const validPass = await bcrypt.compare(req.body.passwd, user.passwd);
        if( ! validPass) return [400, 'ERRORE: username o password errati.'];

        let id;
        if(user.privilegi == 0) id = user.id_admin;
        if(user.privilegi == 1) id = user.id_producer;
        if(user.privilegi == 2) id = user.id_consumer;

        // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può accedere alle rotte private (e a quelle pubbliche)
        const token = jwt.sign({ id: id, privilegi: user.privilegi, nome: user.nome, email: user.email }, process.env.TOKEN_SECRET);

        return [200, token];

    }

    async registerProducer(req){

        // controlla se la mail del producer è già registrata
        const producer = await db_producers.findOne({where: { email: req.body.email }});
        if(producer) return [500, "ERRORE: [producer " + producer.id_producer + "] e' gia' registrato."]

        // controlla se la tipologia di fonte è ammessa
        if(! ["fossile", "eolico", "fotovoltaico"].includes(req.body.fonte_produzione)) return [400, "ERRORE: fonte specificata non ammessa."];

        return await producerController.createProducer(req);

    }

    async registerConsumer(req){
        
        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const consumer = await db_consumers.findOne({where: { email: req.body.email }});
        if(consumer) return [500, "ERRORE: [consumer " + consumer.id_consumer + "] e' gia' registrato."]

        return await consumerController.createConsumer(req)

    }

    async registerAdmin(req){

        // CONTROLLO UTENTE REGISTRATO: controlla se l'username è nel db
        const admin = await db_admins.findOne({where: { email: req.body.email }});
        if(admin) return [500, "ERRORE: [admin " + admin.id_admin + "] e' gia' registrato."]

        return await adminController.createAdmin(req);

    }

}


module.exports = authController;