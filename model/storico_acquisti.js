const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Storico_acquisti = sequelize.define('storico_acquisti', {
    idProducer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idConsumer: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idSlot: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    data_acquisto: {
        type: Sequelize.DATE,
        allowNull: false
    },
    emissioni_co2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    credito: {
        type: Sequelize.REAL,
        allowNull: false
    },
    costo_transazione: {
        type: Sequelize.REAL,
        allowNull: false
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = { Storico_acquisti: storico_acquisti };