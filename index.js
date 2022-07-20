const express = require('express');
const app = express();
const database = require('./model/database');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
//const cors = require('cors');

const checkAdmin = require('./middlewares/checkAdmin');
const checkLogin = require('./middlewares/checkLogin');
const checkCredit = require('./middlewares/checkCredit');
const checkProducer = require('./middlewares/checkProducer');
const checkConsumer = require('./middlewares/checkConsumer');

// middlewares
app.use(express.json());
app.use(cors());


console.log('\n' + '----- | POWER COMPRA-VENDITA\'S SERVER | -----' + '\n');


const consumersRoute = require('./routes/consumers');
const producersRoute = require('./routes/producers');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth')
const slotRoutes = require('./routes/slot');


app.use('/api/consumers', [checkLogin, checkConsumer, checkCredit]);
app.use('/api/consumers', consumersRoute);

app.use('/api/producers', [checkLogin, checkProducer]);
app.use('/api/producers', producersRoute);

app.use('/api/admin', [checkLogin, checkAdmin]);
app.use('/api/admin', adminRoutes);

app.use('/api/slot', [checkLogin, checkConsumer, checkCredit]);
app.use('/api/slot', slotRoutes);

app.use('/api/auth', authRoutes);


connessioneDB();


// messa in ascolto del server sulla porta specificata nel file .env
const port = process.env.PORT;
app.listen(port, () => console.log('In ascolto sulla porta ' + port));


async function connessioneDB(){
       
    try {

        await database.sequelize; // corrisponde a database.Singleton.creaSingleton.getInstance()
        console.log('Database connesso');
    
        await database.sequelize.sync(); // corrisponde a database.Singleton.creaSingleton.getInstance().sync()
        console.log("Database sincronizzato"); 

    } catch (err) {
        console.error('Errore di connessione al database: \n', err);
    }
    
}