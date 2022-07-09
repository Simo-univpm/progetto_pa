//gestisce slot, token e le transazioni tra produttori e consumatori.
const mqtt = require('mqtt')

/*
const options_wifi = {
  keepalive: 60,
  clientId: clientId_wifi_status,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: '[WEB UI] WIRELESS_CONNECTIONS closed abnormally..!',
    qos: 0,
    retain: false
  },
}

const client_wifi = mqtt.connect(address_mqtt, options_wifi)
*/


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