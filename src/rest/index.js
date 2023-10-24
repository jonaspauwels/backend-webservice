const Router = require('@koa/router');
const installFruitRouter = require('./fruit');
const installHealthRoutes = require('./health')
const installOogstplaatsRoutes = require('./oogstplaats')

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installFruitRouter(router);
  installHealthRoutes(router);
  installOogstplaatsRoutes(router);

  app.use(router.routes())
     .use(router.allowedMethods());
};
