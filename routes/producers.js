const router = require('express').Router();

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();


// per CRUD =========================================================================
// get one specific producer
router.get('/', async (req, res) => {

    var result = await producerController.getProducer(req.body.id)
    res.status(result[0]).json(result[1]);
    
});

// create one producer
router.post('/', async (req, res) => {

    var result = await producerController.createProducer(req.body)
    res.status(result[0]).json(result[1]);
    
});

// edit producer field
router.patch('/', async (req, res) => {

    var result = await producerController.editSlotKwLimit(req.body)
    res.status(result[0]).json(result[1]);
    
});

// delete one producer
router.delete('/', async (req, res) => {

    var result = await producerController.delete(req.body.id)
    res.status(result[0]).json(result[1]);
    
});


// per la consegna ==================================================================
router.get('/producer/checkReservations', async (req, res) => {

    var result = await producerController.checkReservations(req.body)
    res.status(result[0]).json(result[1]);
    
});


router.get('/producer/checkStats', async (req, res) => {

    var result = await producerController.checkStats(req.body)
    res.status(result[0]).json(result[1]);
    
});


router.get('/producer/checkEarnings', async (req, res) => {

    var result = await producerController.checkEarnings(req.body)
    res.status(result[0]).json(result[1]);
    
});



module.exports = router;