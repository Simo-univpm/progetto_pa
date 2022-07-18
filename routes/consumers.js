const router = require('express').Router();

const checkAdmin = require('../middlewares/checkAdmin');
const checkLogin = require('../middlewares/checkLogin');
const checkCredit = require('../middlewares/checkCredit');

const ConsumerController = require('../controllers/consumerController');
const consumerController = new ConsumerController();


// edit consumer's credit field
router.patch('/', async (req, res) => {

    var result = await consumerController.editConsumerCredit(req)
    res.status(result[0]).json(result[1]);
    
});

router.get('/getPurchaseList', checkLogin, async (req, res) => {

    var result = await consumerController.getPurchaseList(time_period)
    res.status(result[0]).json(result[1]);
    
});

router.get('/getEmissions', checkLogin, async (req, res) => {

    var result = await consumerController.getEmissions(time_period)
    res.status(result[0]).json(result[1]);
    
});




module.exports = router;