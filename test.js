/*
var slot_totale = 500
var slot_rimanente = 500 
let app = "totale: " + String(slot_totale) + ", rimanente: " + String(slot_rimanente)
app = JSON.stringify(app)
console.log(app)
*/



const ProducerController = require('./controllers/producerController');
const producerController = new ProducerController();


// aggiorno kw rimanenti per lo slot
async function test_edit_slot(){

    try{
        await producerController.editSlot(4, 2, "totale", 250)
        console.log("OK")
    }catch(err){
        console.log(err)
    }

    return 0

}


test_edit_slot()