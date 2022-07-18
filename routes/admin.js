const router = require('express').Router();

const checkAdmin = require('../middlewares/checkAdmin');
const checkLogin = require('../middlewares/checkLogin');

const AdminController = require('../controllers/adminController');
const adminController = new AdminController();


router.post('/ricarica', checkLogin, checkAdmin, async (req, res) => {

    var result = await adminController.ricarica(req)
    res.status(result[0]).json(result[1]);
    
});


module.exports = router;