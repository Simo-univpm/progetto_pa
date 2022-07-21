const { Sequelize } = require('sequelize');
const sequelize = require('./singleton').sequelize; // corrisponde a singleton.sequelize, ovvero alla connesione singleton di sequelize --> database.Singleton.genera_singleton.get_istanza()


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