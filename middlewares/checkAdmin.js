//verifica se un utente in possesso di token possiede i privilegi di amministratore
const jwt = require('jsonwebtoken');
const User = require('../model/User');


async function isAdmin(req, res, next){

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const maybeAdmin = await User.findOne({userID: decoded.userID});

    req.decoded = decoded;

    if(maybeAdmin.isAdmin) next();
    else return res.status(401).send('UNATHORIZED: user [' + maybeAdmin.username + '] is not admin');

}


module.exports = isAdmin;