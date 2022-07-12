const router = require('express').Router();

const SlotController = require('../controllers/slotController');
const slotController = new SlotController();


router.get('/updateSlot', async (req, res) => {

    var result = await slotController.updateSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/reserveSlot', async (req, res) => {

    var result = await slotController.reserveSlot(req.body)
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

router.get('/createSlot', async (req, res) => {

    var result = await slotController.createSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/updateSlot', async (req, res) => {

    var result = await slotController.updateSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/updateSlotMaxPower', async (req, res) => {

    var result = await slotController.updateSlotMaxPower(req.body)
    res.status(result[0]).json(result[1]);
    
});





module.exports = router;