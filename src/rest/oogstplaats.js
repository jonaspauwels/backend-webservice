const Router = require('@koa/router');
const oogstService = require('../service/oogstplaats');

const getAllOogstplaatsen = async (ctx) => {
  const oogstplaatsen = await oogstService.getAll();  
  ctx.body = oogstplaatsen;
  };
  
const createOogstplaats =  async (ctx) => {
  
    const newOogstplaats = await oogstService.create({
      ...ctx.request.body
    });
    ctx.body = newOogstplaats;
  };

const getOogstplaatsById = async (ctx) => {
    ctx.body = oogstService.getById(Number(ctx.params.id));
  };
  
const updateOogstplaats = async (ctx) => {
    ctx.body = oogstService.updateById(Number(ctx.params.id),
    {...ctx.request.body});
  };
  
const deleteOogstplaats = async (ctx) => {
    fruitService.deleteById(Number(ctx.params.id));
    ctx.body = 204;
  };
/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/oogstplaatsen',
  });

  router.get('/', getAllOogstplaatsen);
  router.post('/', createOogstplaats);
  router.get('/:id', getOogstplaatsById);
  router.put('/:id', updateOogstplaats);
  router.delete('/:id', deleteOogstplaats);

  app.use(router.routes())
     .use(router.allowedMethods());
};
