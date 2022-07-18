//verifica se un utente in possesso di token possiede i privilegi di amministratore

async function checkProducer(req, res, next){

    if(req.user.privilegi == 1) next();
    else return res.status(401).send('UNATHORIZED: user is not a producer');

}


module.exports = checkProducer;