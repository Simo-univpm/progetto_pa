'use strict'

const mqtt = require('../..')
const client = mqtt.connect()

// or const client = mqtt.connect({ port: 1883, host: '192.168.1.100', keepalive: 10000});

//sottoscrive al topic 'presence'
client.subscribe('presence')

//pubblica su topic 'presence'
client.publish('presence', 'bin hier')

//riceve messaggi dal topic 'message'
client.on('message', function (topic, message) {
  console.log(message)
})
client.end()