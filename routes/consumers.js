const router = require('express').Router();

const checkAdmin = require('../middlewares/checkAdmin');
const checkLogin = require('../middlewares/checkLogin');
const checkCredit = require('../middlewares/checkCredit');

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();


// per CRUD =========================================================================
// get one specific consumer
router.get('/', async (req, res) => {

    var result = await consumerController.getConsumer(req)
    res.status(result[0]).json(result[1]);
    
});

// create one consumer
router.post('/', async (req, res) => {

    var result = await consumerController.createConsumer(req)
    res.status(result[0]).json(result[1]);
    
});

// edit consumer's credit field
router.patch('/', async (req, res) => {

    var result = await consumerController.editConsumerCredit(req)
    res.status(result[0]).json(result[1]);
    
});


// delete one consumer
router.delete('/', async (req, res) => {

    var result = await consumerController.delete(req)
    res.status(result[0]).json(result[1]);
    
});


// per la consegna ==================================================================
router.get('/getPurchaseList', checkLogin, async (req, res) => {

    var result = await consumerController.getPurchaseList(time_period)
    res.status(result[0]).json(result[1]);
    
});

router.get('/getEmissions', checkLogin, async (req, res) => {

    var result = await consumerController.getEmissions(time_period)
    res.status(result[0]).json(result[1]);
    
});




module.exports = router;