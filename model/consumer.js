const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Consumer = sequelize.define('consumer', {
    id_consumer: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
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
    credito: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    privilegi: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_registrazione: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, 
{ 
    timestamps: false,
    freezeTableName: true
});

module.exports = { consumer: Consumer };