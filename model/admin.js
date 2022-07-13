const { Sequelize } = require('sequelize');
const sequelize = require('./database').sequelize; // corrisponde a database.sequelize, ovvero alla connesione singleton di sequelize --> Singleton.creaSingleton.getInstance()


// Definizione del modello Sequelize dell'utente
const Admin = sequelize.define('admin', {
    id_admin: {
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
    privilegi: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_registrazione: {
        type: Sequelize.DATE,
        allowNull: false
    }, 
},    
{ 
    timestamps: false,
    freezeTableName: true
});

module.exports = { admin: Admin };