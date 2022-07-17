const router = require('express').Router();

const checkLogin = require('../middlewares/checkLogin');

const SlotController = require('../controllers/slotController');
const slotController = new SlotController();


router.post('/reserveSlot', checkLogin, async (req, res) => {

    var result = await slotController.reserveSlot(req.body, req.user.id)
    res.status(result[0]).json(result[1]);
    
});

router.patch('/editSlot', checkLogin, async (req, res) => {

    var result = await slotController.editSlot(req.body, req.user.id)
    res.status(result[0]).json(result[1]);
    
});



module.exports = router;