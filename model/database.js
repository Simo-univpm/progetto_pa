const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Uso del pattern Singleton per la gestione della connessione al Database

class Singleton{
    
    static creaSingleton = (function () {
        let instance;

        function createInstance() {
            const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
                host: process.env.PG_HOST,
                port: process.env.PG_PORT,
                dialect: 'postgres',
                logging: false
            });
            return sequelize;
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();


}

module.exports = { sequelize: Singleton.creaSingleton.getInstance() };