/*
var slot_totale = 500
var slot_rimanente = 500 
let app = "totale: " + String(slot_totale) + ", rimanente: " + String(slot_rimanente)
app = JSON.stringify(app)
console.log(app)
*/

/*

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

*/
const today = new Date();
const tomorrow = new Date();

//funzione per calcolare la differenza di ore tra 2 date
function diff_hours(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(diff);

}

// Add 1 Day
tomorrow.setDate(today.getDate() + 1);
tomorrow.setHours(16, 0, 0);
console.log(today);
console.log(tomorrow);
if(Math.round(diff_hours(tomorrow, today)) < 24){
    console.log("Slot non prenotabile");
}else { console.log("Slot prenotabile"); }
console.log(Math.round(diff_hours(tomorrow, today)));