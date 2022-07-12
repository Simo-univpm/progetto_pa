const router = require('express').Router();

const AdminController = require('../controllers/adminController');
const adminController = new AdminController();


router.get('/test_get', async (req, res) => {
    
    var result = await adminController.test_get()
    res.status(result[0]).json(result[1]);

});



router.get('/addCredit', async (req, res) => {

    var result = await adminController.addCredit(req.body)
    res.status(result[0]).json(result[1]);
    
});


module.exports = router;