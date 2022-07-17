function createRemap(x, inMin, inMax, outMin, outMax) {

    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    
}


// 200 + 400 + 500 = 1100
let nigiri_percentuale = createRemap(200, 0, 1100, 0, 1000);
let mima_percentuale = createRemap(400, 0, 1100, 0, 1000);
let noodles_percentuale = createRemap(500, 0, 1100, 0, 1000);

console.log("nigiri_percentuale: ", nigiri_percentuale)
console.log("mima_percentuale: ", mima_percentuale)
console.log("noodles_percentuale: ", noodles_percentuale)

let somma = nigiri_percentuale + mima_percentuale + noodles_percentuale
console.log(somma)
