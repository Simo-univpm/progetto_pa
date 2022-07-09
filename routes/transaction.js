//gestisce slot, token e le transazioni tra produttori e consumatori.
const router = require('express').Router();

const TransactionController = require('../controller/transactionController');
const transactionController = new TransactionController();


router.get('/ciao', async (req, res) => {
    
    /* arriva una richiesta GET con un body simile:
    {
        "producer": "enel",
        "amount": 10,
        "period": ["2022-07-22", 18]
    }*/
    
    var result = await transactionController.reserveSlot(req.body);
    res.status(result[0]).json(result[1]);
    
});


module.exports = router;