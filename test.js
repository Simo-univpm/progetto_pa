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
