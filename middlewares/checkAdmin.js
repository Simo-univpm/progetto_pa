//verifica se un utente in possesso di token possiede i privilegi di amministratore
const jwt = require('jsonwebtoken');
const db_admins = require('../model/admin').admin;


async function checkAdmin(req, res, next){

    if(req.user.privilegi == 0) next();
    else return res.status(401).send('UNATHORIZED: user is not admin');

}


module.exports = checkAdmin;