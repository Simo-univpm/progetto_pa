const router = require('express').Router();

const SlotController = require('../controllers/slotController');
const slotController = new SlotController();

router.post('/', async (req, res) => {

    var result = await slotController.reserveSlot(req)
    res.status(result[0]).json(result[1]);
    
});

router.patch('/', async (req, res) => {

    var result = await slotController.editSlot(req)
    res.status(result[0]).json(result[1]);
    
});





module.exports = router;