const Router = require('@koa/router');
const installFruitRouter = require('./fruit');

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

  app.use(router.routes())
     .use(router.allowedMethods());
};
