const router = require('express').Router();

const checkLogin = require('../middlewares/checkLogin');
const checkProducer = require('../middlewares/checkProducer');

const ProducerController = require('../controllers/producerController');
const producerController = new ProducerController();


// edit producer's slot kw limit
router.patch('/kw', checkLogin, checkProducer, async (req, res) => {

    if(req.body.slot == "all"){

        for(let i = 0; i < 24; i++) var result = await producerController.editSlot(req.user.id, i, "totale", req.body.kw)
        res.status(result[0]).json(result[1]);

    } else {

        var result = await producerController.editSlot(req.user.id, req.body.slot, "totale", req.body.kw)
        res.status(result[0]).json(result[1]);

    }

});

// edit producer's slot price
router.patch('/costo', checkLogin, checkProducer, async (req, res) => {

    if(req.body.slot == "all"){

        for(let i = 0; i < 24; i++) var result = await producerController.editSlot(req.user.id, i, "costo", req.body.costo)
        res.status(result[0]).json(result[1]);

    } else {

        var result = await producerController.editSlot(req.user.id, req.body.slot, "costo", req.body.costo)
        res.status(result[0]).json(result[1]);

    }

});

router.get('/checkReservations', checkLogin, async (req, res) => {

    var result = await producerController.checkReservations(req.user.id, req.body.slot_inizio, req.body.slot_fine)
    res.status(result[0]).json(result[1]);
    
});

router.get('/checkStats', checkLogin, async (req, res) => {

    var result = await producerController.checkStats(req.user.id, req.body.inizio, req.body.fine)
    res.status(result[0]).json(result[1]);
    
});

router.get('/checkEarnings', checkLogin, async (req, res) => {

    var result = await producerController.checkEarnings(req.user.id, req.body.inizio, req.body.fine)
    res.status(result[0]).json(result[1]);
    
});

module.exports = router;