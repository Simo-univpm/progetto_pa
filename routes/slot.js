const router = require('express').Router();

const checkLogin = require('../middlewares/checkLogin');
const checkCredit = require('../middlewares/checkCredit');
const checkConsumer = require('../middlewares/checkConsumer');

const SlotController = require('../controllers/slotController');
const slotController = new SlotController();


router.post('/reserveSlot', checkLogin, checkConsumer, checkCredit, async (req, res) => {

    var result = await slotController.reserveSlot(req)
    res.status(result[0]).json(result[1]);
    
});

router.patch('/editSlot', checkLogin, checkConsumer, checkCredit, async (req, res) => {

    var result = await slotController.editSlot(req)
    res.status(result[0]).json(result[1]);
    
});



module.exports = router;