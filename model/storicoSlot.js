const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const StoricoSlot = sequelize.define('storicoSlot', {
    idSlot: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idConsumer: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    data_acquisto: {
        type: Sequelize.STRING,
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

module.exports = { storicoSlot: StoricoSlot };