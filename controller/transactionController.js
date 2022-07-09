//gestisce slot, token e le transazioni tra produttori e consumatori.
class transactionController {

    constructor(){}
    

    async reserveSlot(body){

        //let prova = [200, "ciao!!"]
        //return prova



        // consumer hitta la GET
        // controller si iscrive al broker
        // controller invia il json col body della richiesta al broker 
        // producer si iscrivono al topic /to_producer
        // producer ricevono la richiesta per lo slot del consumer
        // producerController verifica la disponibilità dello slot
        // producerController assegna lo slot al consumer che lo ha richiesto
        // producerController scalano i soldi al consumer



    
    }

}


module.exports = transactionController;