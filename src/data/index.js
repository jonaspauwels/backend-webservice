const {Sequelize, DataTypes} = require('sequelize');
const { getLogger } = require('../core/logging');
const { initializeModel, fruitsoort } = require('./model');

const config = require('config');

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('datapas');

let sequelize

async function initializeData() {
    const logger = getLogger();
    logger.info('Initializing database connection...')

    

    sequelizeOptions = {
        database: DATABASE_NAME,
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
        dialect: DATABASE_CLIENT,
        options: {
            host: DATABASE_HOST,
            port: DATABASE_PORT,
            logging: msg => logger.info(msg),
        }
    }

    sequelize = new Sequelize(sequelizeOptions);

    try {
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');
      } catch (error) {
        logger.error('Unable to connect to the database:', error);
      }

    
    initializeModel(sequelize)

    

    return sequelize;
};



function getSequelize() {
    if (!sequelize)
        throw new Error('Data is not initialized')
    return sequelize;
};

module.exports = {
    initializeData,
    getSequelize,
};