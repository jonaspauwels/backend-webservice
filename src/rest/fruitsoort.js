const Router = require('@koa/router');
const fruitService = require('../service/fruitsoort');
const Joi = require('joi');
const validate = require('../core/validation');


const getAllFruitsoorten = async (ctx) => {
  ctx.body = await fruitService.getAll();  
};

getAllFruitsoorten.validationScheme = null

const getFruitsoortById = async (ctx) => {
  ctx.body = fruitService.getById(Number(ctx.params.id));
};

getFruitsoortById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};
  
const getKoelcellenByFruitsoortId = async (ctx) => {
  ctx.body = fruitService.getKoelcellenByFruitsoortId()
}

const createFruitsoort =  async (ctx) => {
    const newFruit = await fruitService.create({
      ...ctx.request.body
    });
    
    ctx.body = newFruit;
  };


  
const updateFruitsoort = async (ctx) => {
    ctx.body = fruitService.updateById(Number(ctx.params.id),
    {...ctx.request.body});
  };
  
const deleteFruitsoort = async (ctx) => {
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
    prefix: '/fruitsoorten',
  });

  router.get('/', getAllFruitsoorten);
  router.post('/', createFruitsoort);
  router.get('/:id', getFruitsoortById);
  router.put('/:id', updateFruitsoort);
  router.delete('/:id', deleteFruitsoort);

  app.use(router.routes())
     .use(router.allowedMethods());
};
