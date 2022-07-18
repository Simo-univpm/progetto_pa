const db_producers = require('../model/producer').producer;
/*
function createRemap(x, inMin, inMax, outMin, outMax) {

    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    
}

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

async function getProducerById(id){

    try{

       const producer = await db_producers.findOne({where: { id_producer: id }});
       if( ! producer) return [404, "ERRORE: [producer " + id + "] non trovato."]

       return [200, producer]

    }catch(err){
        return [500, "ERRORE: qualcosa e' andato storto." + err]
    }

}


async function getMultipleSlots(id_producer, slot_inizio, slot_fine){
    
    let result_p = await getProducerById(id_producer) // rimetti this dopo eh
    let producer = result_p[1]

    let selected_slots = []

    try{

        for(let i = slot_inizio; i < slot_fine; i ++){

            let slot_to_read = "slot_" + i

            let slot = producer[slot_to_read]
            selected_slots.push(JSON.parse(slot))

        }

        console.log(selected_slots)
        return selected_slots

    }catch(err){
        return err
    }

}

getMultipleSlots(2, 0, 9);