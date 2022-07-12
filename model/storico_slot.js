const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Slot = sequelize.define('storico_slot', {
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
    data_acquisto: {
        type: Sequelize.DATE,
        allowNull: false
    },
    kwh_richiesti_consumer: {
        type: Sequelize.REAL,
        allowNull: false
    },
    emissioni_co2: {
        type: Sequelize.REAL,
        allowNull: false
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = { storico_slot: Storico_slot };