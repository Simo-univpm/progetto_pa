class slotController {

    constructor(){}

    async reserveSlot(body){

        // si seleziona un produttore
        // si verifica la disponibilità dello slot
        // in caso positivo si opziona lo slot per il giorno seguente
        // si scalano i soldi al consumer
        // si aggiorna il db transazioni con l'esito della transazione attuale

        //funzione per calcolare la differenza di almeno 24 ore tra 2 date
        function diffHours(date1, date2) {
            var diff = (date2.getTime() - date1.getTime()) / 1000;
            diff /= 60 * 60;
            return Math.abs(Math.round(diff));
        }
        

    }

}


module.exports = slotController;