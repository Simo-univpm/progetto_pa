const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Admin = sequelize.define('admin', {
    idAdmin: {
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
        default: "admin",
        allowNull: false
    }

}, { 
    timestamps: false,
    freezeTableName: true
});

module.exports = { admin: Admin };