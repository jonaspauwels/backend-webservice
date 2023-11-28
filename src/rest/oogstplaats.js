const Router = require('@koa/router');
const oogstService = require('../service/oogstplaats');
const Joi = require('joi');

const getAllOogstplaatsen = async (ctx) => {
  ctx.body = await oogstService.getAll();  
  };
  
const createOogstplaats =  async (ctx) => {
    const newOogstplaats = await oogstService.create({
      ...ctx.request.body
    });
    ctx.status = 201;
    ctx.body = newOogstplaats;
  };

const getOogstplaatsById = async (ctx) => {
    ctx.body = await oogstService.getById(Number(ctx.params.id));
  };

getOogstplaatsById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
}
  
const updateOogstplaats = async (ctx) => {
  ctx.body = await oogstService.updateById(Number(ctx.params.id),
  {...ctx.request.body});
    
  };
  
const deleteOogstplaats = async (ctx) => {
    oogstService.deleteById(Number(ctx.params.id));
    ctx.status = 204;
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
