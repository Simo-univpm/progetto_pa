const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');


console.log('\n' + '----- | POWER COMPRA-VENDITA\'S SERVER | -----' + '\n');


// middlewares
app.use(express.json());
app.use(cors());


// imported routes
//const authRoute = require('./routes/auth');
//const adminRoute = require('./routes/admin');
//const consumerRoute = require('./routes/consumer');
//const producerRoute = require('./routes/producer');
const transactionRoute = require('./routes/transaction');


// route middlewares
//app.use('/api/auth', authRoute);
//app.use('/api/admin', adminRoute);
//app.use('/api/consumer', consumerRoute);
//app.use('/api/producer', producerRoute);
app.use('/api/transaction', transactionRoute);


// db connection ==================================================================

// vedere se va lasciata qui o se va spostata in model col singleton

// =================================================================================

// server port
const port = process.env.PORT;
app.listen(port, () => console.log('- listening on port ' + port));