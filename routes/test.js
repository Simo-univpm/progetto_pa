const router = require('express').Router();

const db_consumers = require('../model/consumer').consumer; // corrisponde a database.utente.findAll

router.get('/test_get', async (req, res) => {
    
    const consumers = await db_consumers.findAll();
    res.status(200).json(consumers);

});

module.exports = router;