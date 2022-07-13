const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Producer = sequelize.define('producer', {
    id_producer: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    codice_fiscale: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    passwd: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fonte_produzione: {
        type: Sequelize.STRING,
        allowNull: false
    },
    costo_per_kwh: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    emissioni_co2: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    privilegi: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_0: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_3: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_4: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_5: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_6: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_7: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_8: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_9: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_10: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_11: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_12: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_13: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_14: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_15: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_16: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_17: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_18: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_19: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_20: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_21: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_22: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slot_23: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, 
{ 
    timestamps: false,
    freezeTableName: true
});

//toJson

module.exports = { producer: Producer };