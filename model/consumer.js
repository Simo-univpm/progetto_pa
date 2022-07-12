const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Consumer = sequelize.define('consumer', {
    idConsumer: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    passwd: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ruolo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    emissioni_co2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ruolo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    credito: {
        type: Sequelize.REAL,
        allowNull: false
    },
    storico_acquisti: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = { consumer: Consumer };