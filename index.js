// imported packages
const express = require('express');
const app = express();
const router = require('express').Router();


router.get('/', async (req, res) => {

    res.send("diocane")
    
});



// server port
//const port = process.env.PORT;
//app.listen(port, () => console.log('- listening on port ' + port));
app.listen(8080, () => console.log('- listening on port 8080'));