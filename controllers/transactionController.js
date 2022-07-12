//gestisce slot, token e le transazioni tra produttori e consumatori.
//const mqtt = require('mqtt')


/*const options_producer = {
  keepalive: 60,
  clientId: "test id",
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000
}

const client_producer = mqtt.connect("mqtt://localhost:1883", options_producer)

client_producer.on('connect', function () {
  client_producer.subscribe('test', function (err) {
    if (!err) {
      client_producer.publish('presence', 'ciao')
    }
  })
})

client_producer.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client_producer.end()
})

*/

class transactionController {

    constructor(){}
    

    async reserveSlot(){


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