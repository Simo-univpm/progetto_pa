const express = require('express');
const app = express();
const database = require('./model/database');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
//const cors = require('cors');

// middlewares
app.use(express.json());
app.use(cors());

console.log('\n' + '----- | POWER COMPRA-VENDITA\'S SERVER | -----' + '\n');

const consumersRoute = require('./routes/consumers');
const producersRoute = require('./routes/producers');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth')
const slotRoutes = require('./routes/slot');

app.use('/api/consumers', consumersRoute);
app.use('/api/producers', producersRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/slot', slotRoutes); // tutte le chiamate per gestire le transazioni tra consumer, producer e slot
app.use('/api/auth', authRoutes); // le chiamate per effettuare login e registrazione

connessioneDB();


// si verifica se è passato un giorno per salvare lo storico dei producer a db a fine giornata //


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