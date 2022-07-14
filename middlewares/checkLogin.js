//verifica se un utente è in possesso del token e se quindi è autenticato
const jwt = require('jsonwebtoken');

/*
Questo è un middleware, possiamo aggiungerlo ad ogni route che vogliamo sia protetta o privta;
queste routes non possono essere utilizzate se l'utente non è in possesso del token.
Il token si ottiene al login.
*/

function verifyToken(req, res, next){

    // controllo della presenza del token nell'header
    const token = req.header('auth-token');
    if( ! token) return res.status(401).send('ACCESS DENIED');

    try{

        // verifica validità token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;

        next();

    }catch(err){
        res.status(400).send('ERROR: Invalid token' + err);
    }

}


module.exports = verifyToken;