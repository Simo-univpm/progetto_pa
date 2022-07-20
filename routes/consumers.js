const router = require('express').Router();

const checkAdmin = require('../middlewares/checkAdmin');
const checkLogin = require('../middlewares/checkLogin');
const checkCredit = require('../middlewares/checkCredit');

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

// edit consumer's credit field // DA RIMUOVERE ????
/*
router.patch('/', async (req, res) => {

    var result = await consumerController.editConsumerCredit(req)
    res.status(result[0]).json(result[1]);
    
});
*/

router.get('/transactions/producer', async (req, res) => {

    var result = await consumerController.getPurchaseListProducer(req.user.id, req.body.id)
    res.status(result[0]).json(result[1]);
    
});

router.get('/transactions/fonte', async (req, res) => {

    var result = await consumerController.getPurchaseListFonte(req.user.id, req.body.fonte)
    res.status(result[0]).json(result[1]);
    
});

router.get('/transactions/periodo', async (req, res) => {

    var result = await consumerController.getPurchaseListPeriodo(req.user.id, req.body.inizio, req.body.fine)
    res.status(result[0]).json(result[1]);
    
});

router.get('/emissions', async (req, res) => {

    var result = await consumerController.getEmissions(req.user.id, req.body.inizio, req.body.fine)
    res.status(result[0]).json(result[1]);
    
});




module.exports = router;