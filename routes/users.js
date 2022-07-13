const router = require('express').Router();

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();

const AdminController = require('../controllers/adminController');
const adminController = new AdminController();


// per i consumer ==================================================================
router.get('/getPurchaseList', async (req, res) => {

    var result = await consumerController.getPurchaseList(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/getEmissions', async (req, res) => {

    var result = await consumerController.getEmissions(req.body)
    res.status(result[0]).json(result[1]);
    
});



// per i producer ==================================================================
router.get('/checkReservations', async (req, res) => {

    var result = await producerController.checkReservations(req.body)
    res.status(result[0]).json(result[1]);
    
});


router.get('/checkStats', async (req, res) => {

    var result = await producerController.checkStats(req.body)
    res.status(result[0]).json(result[1]);
    
});


router.get('/checkEarnings', async (req, res) => {

    var result = await producerController.checkEarnings(req.body)
    res.status(result[0]).json(result[1]);
    
});



// per gli admin ===================================================================
router.get('/admin/addCredit', async (req, res) => {

    var result = await adminController.addCredit(req.body)
    res.status(result[0]).json(result[1]);
    
});







module.exports = router;