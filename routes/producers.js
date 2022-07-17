const router = require('express').Router();

const checkLogin = require('../middlewares/checkLogin');

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();


// per CRUD =========================================================================
// get one specific producer
router.get('/', async (req, res) => {

    var result = await producerController.getProducer(req)
    res.status(result[0]).json(result[1]);
    
});

// create one producer
router.post('/', async (req, res) => {

    var result = await producerController.createProducer(req)
    res.status(result[0]).json(result[1]);
    
});

// edit producer's slot kw limit
router.patch('/kw', async (req, res) => {

    var result = await producerController.editSlotKwLimit(req)
    res.status(result[0]).json(result[1]);
    
});

// edit producer's slot price
router.patch('/price', async (req, res) => {

    var result = await producerController.editSlotPrice(req)
    res.status(result[0]).json(result[1]);
    
});

// delete one producer
router.delete('/', async (req, res) => {

    var result = await producerController.delete(req)
    res.status(result[0]).json(result[1]);
    
});


// per la consegna ==================================================================
router.get('/producer/checkReservations', checkLogin, async (req, res) => {

    var result = await producerController.checkReservations(req.body)
    res.status(result[0]).json(result[1]);
    
});


router.get('/producer/checkStats', checkLogin, async (req, res) => {

    var result = await producerController.checkStats(req.body)
    res.status(result[0]).json(result[1]);
    
});


router.get('/producer/checkEarnings', checkLogin, async (req, res) => {

    var result = await producerController.checkEarnings(req.body)
    res.status(result[0]).json(result[1]);
    
});



module.exports = router;