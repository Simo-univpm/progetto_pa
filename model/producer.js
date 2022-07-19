const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


/// RIMETTERE GLI SLOT CON ALLOWNULL A FALSE

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
    //codice_fiscale: {
    //    type: Sequelize.STRING,
    //    allowNull: false
    //},
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
    emissioni_co2: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    privilegi: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    slot_0: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_3: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_4: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_5: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_6: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_7: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_8: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_9: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_10: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_11: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_12: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_13: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_14: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_15: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_16: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_17: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_18: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_19: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_20: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_21: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_22: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slot_23: {
        type: Sequelize.STRING,
        allowNull: true
    },
    data_registrazione: {
        type: Sequelize.DATE,
        allowNull: false
    },
    accetta_taglio_richieste: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, 
{ 
    timestamps: false,
    freezeTableName: true
});


module.exports = { producer: Producer };