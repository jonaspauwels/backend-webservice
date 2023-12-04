const {Sequelize} = require('sequelize');
const { getLogger } = require('../core/logging');
const { initializeModel } = require('./model');
const { Umzug, SequelizeStorage } = require('umzug');
const mysql = require('mysql2/promise')

const config = require('config');

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');

let sequelize

async function initializeData() {
    const logger = getLogger();
    logger.info('Initializing database connection...');

    sequelizeOptions = {
        database: DATABASE_NAME,
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
        dialect: DATABASE_CLIENT,
        host:DATABASE_HOST,
        port: DATABASE_PORT,
        options: {
            logging: msg => logger.info(msg),
        }
    };
    // connecteren met mysql en database creëeren indien onbestaande
    logger.info('Creating Database if not exists');
    const connection = await mysql.createConnection({ host: DATABASE_HOST, port: DATABASE_PORT, user: DATABASE_USERNAME, password: DATABASE_PASSWORD });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME}\`;`);
    connection.close();

    sequelize = new Sequelize(sequelizeOptions);

 

    //connectie leggen via sequelize
    try {
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');
      } catch (error) {
        logger.error('Unable to connect to the database:', error);
      }
      
     //model aanmaken voor sequelize zodat het verder gebruikt kan worden voor CRUD-operaties
     initializeModel(sequelize);
    //migrations uitvoeren via Umzug
    const migrations = new Umzug({
        migrations: { glob: 'src/data/migrations/*.js',
        resolve: ({ name, path, context }) => {
            const migration = require(path)
            return {
                name,
                up: async () => migration.up(context, Sequelize),
                down: async () => migration.down(context, Sequelize),
            }
        },
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,    
    })

    // try { await migrations.up();
    //       logger.info('Migrations succeeded');
    //     } catch (error) {
    //         logger.error('Error occured during migrations');
    //         throw new Error(error);
    //     }
    

    if (process.env.NODE_ENV === 'development') {
        const seeders = new Umzug({
            migrations: { glob: 'src/data/seeders/*.js',
            resolve: ({ name, path, context }) => {
                const migration = require(path)
                return {
                    name,
                    up: async () => migration.up(context, Sequelize),
                    down: async () => migration.down(context, Sequelize),
                }
            },
            },
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({ sequelize }),
            logger: console,    
        })
    
        try { await seeders.up();
              logger.info('Seeders succeeded');
            } catch (error) {
                logger.error('Error occured during seeding');
            }
    }
   
    
    

    return sequelize;
};

async function shutdownData() {
    const logger = getLogger();

    logger.info('Shutting down database connection');
    await sequelize.close();
    sequelize = null;

    logger.info('Database connection closed');
}


function getSequelize() {
    if (!sequelize)
        throw new Error('Data is not initialized')
    return sequelize;
};

module.exports = {
    initializeData,
    getSequelize,
    shutdownData,
};