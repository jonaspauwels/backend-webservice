// index.js
const Koa = require('koa');
const winston = require('winston');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const transactionService = require('./service/transaction')

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
const router = new Router();

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({silent: LOG_DISABLED})
  ]
});

const app = new Koa();

app.use(bodyParser());

router.get('/api/transactions', async (ctx) => {
  ctx.body = transactionService.getAll();
});

router.post('/api/transactions', async (ctx) => {
  const newTransaction = transactionService.create({
    ...ctx.request.body
  });
  ctx.body = newTransaction;
})

router.get('/api/transactions/:id', async (ctx) => {
  ctx.body = transactionService.getById(Number(ctx.params.id))
});



app.use(router.routes())
  .use(router.allowedMethods());



app.listen(9000, () => {
    logger.info('server opgestart')
});
