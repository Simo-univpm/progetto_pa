//verifica se un utente in possesso di token possiede i privilegi di amministratore

async function checkConsumer(req, res, next){

    if(req.user.privilegi == 2) next();
    else return res.status(401).send('UNATHORIZED: user is not consumer');

}

module.exports = checkConsumer;