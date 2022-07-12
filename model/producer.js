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
        default: "producer",
        allowNull: false
    },
    fonte: {
        type: Sequelize.STRING,
        allowNull: false
    },
    costo_per_kwh: {
        type: Sequelize.REAL,
        default: 0,
        allowNull: false
    },
    emissioni_co2: {
        type: Sequelize.STRING,
        default: 0,
        allowNull: true
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = { producer: Producer };