const router = require('express').Router();

const AuthController = require('../controllers/authController');
const authController = new AuthController();


// per tutti gli utenti ============================================================
router.post('/login', async (req, res) => {

    var result = await authController.login(req)
    res.status(result[0]).json(result[1]);
    
});

router.post('/registerProducer', async (req, res) => {

    var result = await authController.registerProducer(req)
    res.status(result[0]).json(result[1]);
    
});

router.post('/registerConsumer', async (req, res) => {

    var result = await authController.registerConsumer(req)
    res.status(result[0]).json(result[1]);
    
});

router.post('/registerAdmin', async (req, res) => {

    var result = await authController.registerAdmin(req.body)
    res.status(result[0]).json(result[1]);
    
});





module.exports = router;