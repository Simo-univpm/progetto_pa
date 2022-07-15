const router = require('express').Router();

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
router.get('/admin/addCredit', async (req, res) => {

    var result = await adminController.addCredit(req.body)
    res.status(result[0]).json(result[1]);
    
});


module.exports = router;