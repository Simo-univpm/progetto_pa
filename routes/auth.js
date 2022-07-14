const router = require('express').Router();


// DA RIMUOVERE
const checkLogin = require('../middlewares/checkLogin');
const checkAdmin = require('../middlewares/checkAdmin');

const AuthController = require('../controllers/authController');
const authController = new AuthController();



// per tutti gli utenti ============================================================
router.post('/login', async (req, res) => {

    var result = await authController.login(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.post('/registerProducer', async (req, res) => {

    var result = await authController.registerProducer(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.post('/registerConsumer', async (req, res) => {

    var result = await authController.registerConsumer(req.body)
    res.status(result[0]).json(result[1]);
    
});

router.post('/registerAdmin', async (req, res) => {

    var result = await authController.registerAdmin(req.body)
    res.status(result[0]).json(result[1]);
    
});



// DA RIMUOVERE
router.get('/test_login', checkLogin, async (req, res) => {

    res.status(200).json("utente loggato");
    console.log(req.user)

});

router.get('/test_admin_login', checkLogin, checkAdmin, async (req, res) => {

    res.status(200).json("utente admin loggato");
    console.log(req.user)

});





module.exports = router;