const express = require('express');
const app = express();
const database = require('./model/database');
const dotenv = require('dotenv');
dotenv.config();
//const cors = require('cors');

// middlewares
app.use(express.json());
//app.use(cors());

console.log('\n' + '----- | POWER COMPRA-VENDITA\'S SERVER | -----' + '\n');

const rottaTest = require('./routes/test');
app.use('/api/test', rottaTest);

const transactionRoutes = require('./routes/transactions');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')

app.use('/api/transactions', transactionRoutes); // tutte le chiamate per gestire le transazioni tra consumer, producer e slot
app.use('/api/users', usersRoutes); // tutte le chiamate per manipolare gli utenti (i producer, i consumer e gli admin)
app.use('/api/auth', authRoutes); // le chiamate per effettuare login e registrazione
app.use('/api/admin', adminRoutes); // contiene la rotta per effettuare la ricarica del credito del consumer

// connessione al database
connessioneDB();

// messa in ascolto del server sulla porta specificata nel file .env
const port = process.env.PORT;
app.listen(port, () => console.log('Listening on port ' + port));




async function connessioneDB(){
       
    try {

        await database.sequelize; // aka database.Singleton.creaSingleton.getInstance()
        // aggiungi effettivo controllo della connessione qui
        console.log('Connessione stabilita correttamente');
    
        await database.sequelize.sync(); // aka database.Singleton.creaSingleton.getInstance().sync()
        console.log("Sincronizzazione effettuta!"); 
    } catch (error) {
        console.error('Impossibile stabilire una connessione, errore: ', error);
    }
}