const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

class Singleton{
    
    static genera_singleton = (function () {

        // istanza della connessione sequelize al database
        let istanza;

        // crea l'istanza se non esiste
        function crea_istanza() {
            const sequelize = new Sequelize(
                                            process.env.PG_DATABASE, 
                                            process.env.PG_USER, 
                                            process.env.PG_PASSWORD,
                                                {
                                                    host: process.env.PG_HOST,
                                                    port: process.env.PG_PORT,
                                                    dialect: 'postgres',
                                                    logging: false
                                                });
            return sequelize;
        }

        // inizialmente viene richiamata get_istanza() che ritorna l'istanza se già esistente,
        // altrimenti l'istanza viene ritornata andando a generarla tramite il metodo crea_istanza()
        return {
            get_istanza: function () {
                if (!istanza) { istanza = crea_istanza(); }
                return istanza;
            }
        };
        
    })();

}

module.exports = { sequelize: Singleton.genera_singleton.get_istanza() };