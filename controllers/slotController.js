const db_producers = require('../model/producer').producer;
const db_consumers = require('../model/consumer').consumer;
const db_admins = require('../model/admin').admin;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class slotController {

    constructor(){}

    async reserveSlot(body){

        /*

        {
            "nome": "asd",     // nome del producer verso il quale si vuole opzionare lo slot
            "slot": "slot_0",  // fascia oraria che si desidera opzionare. lo slot 0 va da 00:00 a 00:59
            "kw": 15           // numero di kw che si vogliono prenotare per quello specifico slot
        }

        */

        // si seleziona un produttore OK
        // si seleziona uno slot OK
        // si verifica la disponibilità dello slot OK
        // in caso positivo si opziona lo slot per il giorno seguente
        // si scalano i soldi al consumer
        // si aggiorna il db transazioni con l'esito della transazione attuale

        // controllo disponibilità produttore
        let selected_producer = await db_admins.findOne({where: {email: body.nome}});
        if(! selected_producer) return [404, 'producer not found'];

        // controllo disponibilità slot
        let selected_slot = JSON.parse(selected_producer[body.slot])

        


        // controllo data
        // controllo soldi
        // controllo disponibilità


        if(body.kw < selected_slot.rimanente){

            selected_slot.rimanente -= body.kw;

        }

    }

}


module.exports = slotController;