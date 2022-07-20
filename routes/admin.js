const router = require('express').Router();

const AdminController = require('../controllers/adminController');
const adminController = new AdminController();

router.post('/ricarica', async (req, res) => {

    var result = await adminController.ricarica(req)
    res.status(result[0]).json(result[1]);
    
});





module.exports = router;