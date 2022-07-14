const jwt = require('jsonwebtoken');
const db_producers = require('../model/producer').producer;
const db_consumers = require('../model/consumer').consumer;
const db_admins = require('../model/admin').admin;

function switchUser(req, res, next){

    let user;
    if(body.privilegi == 0) user = await db_admins.findOne({where: {email: body.email}});
    if(body.privilegi == 1) user = await db_producers.findOne({where: {email: body.email}});
    if(body.privilegi == 2) user = await db_consumers.findOne({where: {email: body.email}});
    if( ! user) return [400, 'wrong username or password'];

    let id;
    if(user.privilegi == 0) id = user.id_admin;
    if(user.privilegi == 1) id = user.id_producer;
    if(user.privilegi == 2) id = user.id_consumer;


    req.user = user
    req.id = id

    next();

}


module.exports = switchUser;