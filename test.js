/*
var slot_totale = 500
var slot_rimanente = 500 
let app = "totale: " + String(slot_totale) + ", rimanente: " + String(slot_rimanente)
app = JSON.stringify(app)
console.log(app)




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

//funzione per salvare la data in una stringa
function saveDate(date){
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let string_date = String(day) + "-" + String(month) + "-" + String(year) + " " + String(hour) + ":" + String(minute) + ":" + String(second);
    console.log(string_date)
    return string_date;
}

//funzione per estrarre la data da una stringa in un oggetto Date
function extractDate(string_date){
    let date = new Date(string_date);
    return date;
}

saveDate(today);
extractDate(today);
console.log(today);
