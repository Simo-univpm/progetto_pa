const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Transazioni = sequelize.define('transazioni', {
    id_transazione: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_consumer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_producer: {
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
    kw_acquistati: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    slot_selezionato: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fonte_produzione: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_acquisto_transazione: {
        type: Sequelize.DATE,
        allowNull: false
    },
    data_prenotazione_transazione: {
        type: Sequelize.DATE,
        allowNull: false
    }, 
},{ 
    timestamps: false,
    freezeTableName: true
});

module.exports = { transazioni: Transazioni };