const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Admin = sequelize.define('transazioni', {
    idTransaction: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idConsumer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idProducer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    emissioni_co2_slot: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    costo_slot: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fonte_produzione: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_transazione: {
        type: Sequelize.STRING,
        allowNull: false
    },
    costo: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, 
},    
{ 
    timestamps: false,
    freezeTableName: true
});

module.exports = { transazioni: Transazioni };