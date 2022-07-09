//gestisce slot, token e le transazioni tra produttori e consumatori.
const mqtt = require('mqtt')


class transactionController {

    constructor(){
        
        client = mqtt.connect('mqtt://localhost:1883')

    }
    

    async reserveSlot(body){


        /*
        consumer hitta la rotta in GET:
        http://localhost:8080/api/transaction/ciao
        {
            "producer": "enel",
            "amount": 10,
            "period": ["2022-07-22", 18]
        }
        
        controller si iscrive al broker
        controller invia il json col body della richiesta al broker 
        producer si iscrivono al topic /to_producer
        producer ricevono la richiesta per lo slot del consumer
        producerController verifica la disponibilità dello slot
        producerController assegna lo slot al consumer che lo ha richiesto
        producerController scalano i soldi al consumer
        */




    
    }

}


module.exports = transactionController;