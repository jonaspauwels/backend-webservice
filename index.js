// index.js
const Koa = require('koa');
const winston = require('winston');

const app = new Koa();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console()
    ]
  });

app.use(async (ctx, next) => {
  ctx.body = 'Hello ';
  await next();
});



app.listen(9000, () => {
    logger.info('server opgestart')
});
