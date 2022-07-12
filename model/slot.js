const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Slot = sequelize.define('slot', {
    idSlot: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idProducer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idConsumer: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    tetto_massimo: {
        type: Sequelize.REAL,
        allowNull: false
    },
    kwh: {
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

module.exports = { slot: Slot };