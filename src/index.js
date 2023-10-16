// index.js
const Koa = require('koa');
const winston = require('winston');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const installRest = require('./rest');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({silent: LOG_DISABLED})
  ]
});

const app = new Koa();

app.use(bodyParser());

installRest(app);


app.listen(9000, () => {
    logger.info('server opgestart')
});
