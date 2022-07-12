const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Producer = sequelize.define('producer', {
    idProducer: {
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
    fonte: {
        type: Sequelize.STRING,
        allowNull: false
    },
    costo_per_kwh: {
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

toJson

module.exports = { producer: Producer };