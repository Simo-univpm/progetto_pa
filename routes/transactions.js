const router = require('express').Router();

const TransactionController = require('../controllers/transactionController');
const transactionController = new TransactionController();


router.get('/updateSlot', async (req, res) => {

    var result = await transactionController.updateSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/reserveSlot', async (req, res) => {

    var result = await transactionController.reserveSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/editReservation', async (req, res) => {

    var result = await transactionController.editReservation(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/cancelReservation', async (req, res) => {

    var result = await transactionController.cancelReservation(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/balanceSlotRequests', async (req, res) => {

    var result = await transactionController.balanceSlotRequests(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/createSlot', async (req, res) => {

    var result = await transactionController.createSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/updateSlot', async (req, res) => {

    var result = await transactionController.updateSlot(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/updateSlotMaxPower', async (req, res) => {

    var result = await transactionController.updateSlotMaxPower(req.body)
    res.status(result[0]).json(result[1]);
    
});





module.exports = router;