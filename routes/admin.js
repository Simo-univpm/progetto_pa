const router = require('express').Router();

const checkAdmin = require('../middlewares/checkAdmin');
const checkLogin = require('../middlewares/checkLogin');

const AdminController = require('../controllers/adminController');
const adminController = new AdminController();

// per CRUD =========================================================================
// get one specific admin
router.get('/', async (req, res) => {

    var result = await adminController.getAdmin(req)
    res.status(result[0]).json(result[1]);
    
});

// create one admin
router.post('/', async (req, res) => {

    var result = await adminController.createAdmin(req)
    res.status(result[0]).json(result[1]);
    
});


// delete one admin
router.delete('/', async (req, res) => {

    var result = await adminController.delete(req)
    res.status(result[0]).json(result[1]);
    
});

// consegna =========================================================================
router.post('/ricarica', checkLogin, checkAdmin, async (req, res) => {

    var result = await adminController.ricarica(req)
    res.status(result[0]).json(result[1]);
    
});


module.exports = router;