const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

async function checkCredit(req, res, next){

    if(req.user.privilegi == 2){

        let result_c = await consumerController.getConsumerById(req.user.id);
        let consumer = result_c[1];

        if(consumer.credito == 0) return res.status(401).send("NON AUTORIZZATO: [consumer " + req.user.id + "] non dispone di credito a sufficienza per continuare");
        else next();

    }
    else return res.status(401).send("NON AUTORIZZATO: l'utente non è un consumer");

}

module.exports = checkCredit;