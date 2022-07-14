const router = require('express').Router();

const checkLogin = require('../middlewares/checkLogin');
const checkConsumer = require('../middlewares/checkConsumer');

const SlotController = require('../controllers/slotController');
const slotController = new SlotController();


router.get('/updateSlot', async (req, res) => {

    var result = await slotController.updateSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.post('/reserveSlot', checkLogin, async (req, res) => {

    var result = await slotController.reserveSlot(req)
    res.status(result[0]).json(result[1]);
    
});

router.get('/editReservation', async (req, res) => {

    var result = await slotController.editReservation(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/cancelReservation', async (req, res) => {

    var result = await slotController.cancelReservation(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/balanceSlotRequests', async (req, res) => {

    var result = await slotController.balanceSlotRequests(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/updateSlotMaxPower', async (req, res) => {

    var result = await slotController.updateSlotMaxPower(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.post('/updateCredit', checkConsumer, async (req, res) => {

    var result = await slotController.updateCredit(id, credit)
    res.status(result[0]).json(result[1]);
    
});






module.exports = router;