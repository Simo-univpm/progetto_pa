const router = require('express').Router();

const DButenti = require('../model/utente').utente; // corrisponde a database.utente.findAll

router.get('/test_get', async (req, res) => {
    
    const utenti = await DButenti.findAll();
    res.status(200).json(utenti);

});

module.exports = router;