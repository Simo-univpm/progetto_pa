const router = require('express').Router();

const AuthController = require('../controllers/authController');
const authController = new AuthController();



// per tutti gli utenti ============================================================
router.get('/login', async (req, res) => {

    var result = await authController.login(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/registerProducer', async (req, res) => {

    var result = await authController.registerProducer(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.get('/registerConsumer', async (req, res) => {

    var result = await authController.registerConsumer(req.body)
    res.status(result[0]).json(result[1]);
    
});




module.exports = router;