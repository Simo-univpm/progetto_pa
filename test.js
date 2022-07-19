/*
let tetto_massimo = 1000;

let consumer = [200, 400, 500];

//funzione che somma tutti i valeori nell'array consumer
function sum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }   
    return sum;
}

//1) "X" fa una richiesta che supera la capacità rimanente del produttore
//2) si tiene in memoria la richiesta di "X"
//3) la richiesta in kw di "X" viene sommata a tutti i kw acquistati delle transazioni all'interno dello stesso slot richiesto
//4) la somma corrisponde al tetto teorico necessario per soddisfare tutti -> y = tetto_massimo_teorico
//5) si fa il map(z, 0, y, 0, tetto_massimo) dove z è il valore in kw acquistato da ogni consumer interno allo slot + la richiesta di x
//6) si assegnano i nuovi kw ai consumer




// 200 + 400 + 500 = 1100
//per i consumer le cui transazioni sono già all'interno dello slot richiesto
let consumer_1 = createRemap(kw_acquistati, 0, tetteo_teorico, 0, tetto_massimo); //-> editSlot
let consumer_2 = createRemap(kw_acquistati, 0, tetteo_teorico, 0, tetto_massimo);//-> editSlot

//per la nuova richiesta di "X"
let X_consumer = createRemap(kw_richiesti, 0, tetteo_teorico, 0, tetto_massimo);//-> reserveSlot




console.log("nigiri_percentuale: ", nigiri_percentuale)
console.log("mima_percentuale: ", mima_percentuale)
console.log("noodles_percentuale: ", noodles_percentuale)

let somma = nigiri_percentuale + mima_percentuale + noodles_percentuale
console.log(somma)



// ==================================================================================================


    1) "X" fa una richiesta che supera la capacità rimanente del produttore
    2) si tiene in memoria la richiesta di "X"
    3) la richiesta in kw di "X" viene sommata a tutti i kw acquistati delle transazioni all'interno dello stesso slot richiesto
    4) la somma corrisponde al tetto teorico necessario per soddisfare tutti -> y = tetto_massimo_teorico
    5) si fa il map(z, 0, y, 0, tetto_massimo) dove z è il valore in kw acquistato da ogni consumer interno allo slot + la richiesta di x
    6) si assegnano i nuovi kw ai consumer

        esempio
        200 + 400 + 500 = 1100
    per i consumer le cui transazioni sono già all'interno dello slot richiesto
    let consumer_1 = createRemap(kw_acquistati, 0, tetteo_teorico, 0, tetto_massimo);
    let consumer_2 = createRemap(kw_acquistati, 0, tetteo_teorico, 0, tetto_massimo);

    per la nuova richiesta di "X"
    let X_consumer = createRemap(kw_richiesti, 0, tetteo_teorico, 0, tetto_massimo);
*/

/*
function createRemap(x, inMin, inMax, outMin, outMax) {

    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    
}

//crea due funzione che prendono valori di rimanente e totale 
let array_totale = [10, 20, 30, 40, 50];
let array_rimanente = [3, 5, 10, 15, 35];


//funzione che calcola la percentuale tra i due array di rimanente e totale e li inserisce in un array
function calcola_percentuale(array_rimanente, array_totale) {
    let array_percentuale = [];
    for (let i = 0; i < array_rimanente.length; i++) {
        array_percentuale.push(createRemap(array_rimanente[i], 0, array_totale[i], 0, 100))    //array_rimanente[i] / array_totale[i]);
        console.log("array_rimanente[" + i + "] " + array_rimanente[i], "array_totale[" + i + "] " + array_totale[i], "array_percentuale[" + i + "] " + array_percentuale[i] + "%")

    }
    return array_percentuale;
}

let array_percentuale_inserito = [];
//funzione che inserisce i valori di percentuale in un array della stessa lunghezza di array_rimanente
function inserisci_percentuale(array_percentuale) {
    for (let i = 0; i < array_percentuale.length; i++) {
        array_percentuale_inserito.push(array_percentuale[i]);
    }
    return array_percentuale_inserito;
}

console.log(inserisci_percentuale(calcola_percentuale(array_rimanente, array_totale)));

//funzione che trasforma da un array di oggetti a un array di numeri
function array_obj_to_num(array_obj) {
    let array_num = [];
    for (let i = 0; i < array_obj.length; i++) {
        array_num.push(array_obj[i].num);
    }
    return array_num;
}


const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
tomorrow.setHours(req.body.slot, 0, 0, 0);

let date = new Date("2020-07-19 20:30")
console.log(date)


let valore = 12;
let stringa = "stringa"

if(typeof valore === 'string'){
    console.log("1")
} else {
    console.log("2")
}


const obj = {"uno":1, "due": 2, "tre": 3}

function asd(...argomenti){

    console.log(argomenti)

}



asd(obj)

*/





/*
async checkStatsNICOLA(id_producer, data_inizio, data_fine){

    let inizio = new Date(data_inizio);
    let fine = new Date(data_fine);


    try{

        var transazioni = await db_transazioni.findAll({ where: {id_producer: id_producer, "data_prenotazione_transazione": {[Op.between] : [inizio , fine]}}});
        if(transazioni.length == 0) return [404, "ERRORE: transazioni non trovate per [producer " + id_producer + "] per il range di date selezionato."]

    }catch(err){
        return [500, "ERRORE: qualcosa e' andato storto." + err]
    }

    //inizio.setHours(0, 0, 0, 0);
    //fine.setHours(0, 0, 0, 0);

    while(inizio <= fine){

        console.log("inizio: ", inizio)
        console.log("fine: ", fine)

        var kw_erogati_per_slot = [];
        var lista_slot_analizzati = [];

        // trovo i kw erogati per ogni slot
        for(let i = 0; i < transazioni.length; i++){

            let slot_corrente = transazioni[i].slot_selezionato;

            // controllo se ho già analizzato le vendite per lo slot corrente
            if( ! lista_slot_analizzati.includes(slot_corrente)) { 

                lista_slot_analizzati.push(slot_corrente)
                var app_slot = { "slot_selezionato": slot_corrente, "kw_acquistati": transazioni[i].kw_acquistati, "kw_massimo": transazioni[i].kw_massimo, "data_prenotazione_transazione": transazioni[i].data_prenotazione_transazione }

            } else continue; // se le ho analizzate salto l'iterazione
            
            // altrimenti si sommano tra di loro i kw acquistati di tutte le transazioni per lo stesso slot
            for(let k = i+1; k < transazioni.length; k++){

                let data_prenotazione_trasformata = new Date(transazioni[k].data_prenotazione_transazione)
                data_prenotazione_trasformata.setHours(0, 0, 0, 0);

                //console.log("data_prenotazione_trasformata: ", data_prenotazione_trasformata)

                if((transazioni[k].slot_selezionato == slot_corrente) && (data_prenotazione_trasformata == inizio)) {
                    app_slot.kw_acquistati += transazioni[k].kw_acquistati
                }

            }

            kw_erogati_per_slot.push(app_slot);

        }

        inizio.setDate(inizio.getDate() + 1);
    }

    let statistiche_slots = [];
    kw_erogati_per_slot.forEach(slot => {
        
        let app_obj = {}
        app_obj["slot"] = slot.slot_selezionato
        app_obj["%_min"] = ((slot.kw_acquistati/slot.kw_massimo) * 100)
        app_obj["%_max"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // inserire matematica di nicola qui
        app_obj["%_med"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // inserire matematica di nicola qui
        app_obj["dev_std"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // inserire matematica di nicola qui

        statistiche_slots.push(app_obj)

    });

    return [200, statistiche_slots]

}

async checkStatsROTTO(id_producer, data_inizio, data_fine){

    let inizio = new Date(data_inizio);
    let fine = new Date(data_fine);

    while(inizio <= fine){

        try{

            let inizio_giornata = inizio.setHours(0,0,0,0);
            let fine_giornata = inizio.setHours(23,59,0,0);

            console.log(inizio)
            console.log(inizio <= fine)

            var transazioni = await db_transazioni.findAll({ where: {id_producer: id_producer, "data_prenotazione_transazione": {[Op.between] : [inizio_giornata, fine_giornata]}}});
            //if(transazioni.length == 0) return [404, "ERRORE: transazioni non trovate per [producer " + id_producer + "] per il range di date selezionato."]

        }catch(err){
            return [500, "ERRORE: qualcosa e' andato storto." + err]
        }

        let kw_erogati_per_slot = [];
        let lista_slot_analizzati = [];

        // trovo i kw erogati per ogni slot
        for(let i = 0; i < transazioni.length; i++){

            let slot_corrente = transazioni[i].slot_selezionato;

            // controllo se ho già analizzato le vendite per lo slot corrente
            if( ! lista_slot_analizzati.includes(slot_corrente)) { 

                lista_slot_analizzati.push(slot_corrente)

                var app_slot = {
                    "slot_selezionato": slot_corrente,
                    "kw_acquistati": transazioni[i].kw_acquistati,
                    "kw_massimo": transazioni[i].kw_massimo,
                    "data_prenotazione_transazione": transazioni[i].data_prenotazione_transazione
                }

            } else continue; // se le ho analizzate salto l'iterazione
            
            // altrimenti si sommano tra di loro i kw acquistati di tutte le transazioni per lo stesso slot
            for(let k = i+1; k < transazioni.length; k++){

                if(transazioni[k].slot_selezionato == slot_corrente) {
                    app_slot.kw_acquistati += transazioni[k].kw_acquistati
                }

            }

            kw_erogati_per_slot.push(app_slot);

        }


        var statistiche_slots = [];
        kw_erogati_per_slot.forEach(slot => {
            
            let app_obj = {}
            app_obj["slot"] = slot.slot_selezionato
            app_obj["date"] = slot.data_prenotazione_transazione
            app_obj["%_min"] = ((slot.kw_acquistati/slot.kw_massimo) * 100)
            app_obj["%_max"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // inserire matematica di nicola qui
            app_obj["%_med"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // inserire matematica di nicola qui
            app_obj["dev_std"] = ((slot.kw_acquistati/slot.kw_massimo) * 100) // inserire matematica di nicola qui

            statistiche_slots.push(app_obj)

        });

        inizio.setDate(inizio.getDate() + 1);
    }


    return [200, statistiche_slots]

}
//var plotly = require('plotly')({"username": "DummySystem29a", "apiKey": "QK0cHj9839WiHwG3vXEr", "host": "localhost", "port": 443})
var plotly = require('plotly')("DummySystem29a", "QK0cHj9839WiHwG3vXEr")

var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
});

*/