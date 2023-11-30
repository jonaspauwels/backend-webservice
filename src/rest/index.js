const Router = require('@koa/router');
const installFruitRoutes = require('./fruitsoort');
const installHealthRoutes = require('./health');
const installOogstplaatsRoutes = require('./oogstplaats');
const installKoelcelRoutes = require('./koelcel');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installFruitRoutes(router);
  installHealthRoutes(router);
  installOogstplaatsRoutes(router);
  installKoelcelRoutes(router);

  app.use(router.routes())
     .use(router.allowedMethods());
};
