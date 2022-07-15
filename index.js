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

// rendi disponibili solo per l'admin
//const consumersRoute = require('./routes/consumers');
//const producersRoute = require('./routes/producers');
//const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth')
const slotRoutes = require('./routes/slot');

// rendi disponibili solo per l'admin
//app.use('/api/consumers', consumersRoute);
//app.use('/api/producers', producersRoute);
//app.use('/api/admin', adminRoutes);
app.use('/api/slot', slotRoutes); // tutte le chiamate per gestire le transazioni tra consumer, producer e slot
app.use('/api/auth', authRoutes); // le chiamate per effettuare login e registrazione


// connessione al database
connessioneDB();


// si verifica se è passato un giorno per salvare lo storico dei producer a db a fine giornata


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