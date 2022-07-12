const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Storico_vendite = sequelize.define('storico_vendite', {
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
    data_vendita: {
        type: Sequelize.DATE,
        allowNull: false
    },
    fonte_produzione: {
        type: Sequelize.STRING,
        allowNull: false
    },
    emissioni_co2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    costo_transazione: {
        type: Sequelize.REAL,
        allowNull: false
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = { Storico_vendite: storico_vendite };