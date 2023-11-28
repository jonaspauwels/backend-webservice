const Router = require('@koa/router');
const oogstService = require('../service/oogstplaats');
const Joi = require('joi');
const validate = require('../core/validation');

const getAllOogstplaatsen = async (ctx) => {
  ctx.body = await oogstService.getAll();  
  };

getAllOogstplaatsen.validationScheme = null;
 
const getOogstplaatsById = async (ctx) => {
  ctx.body = await oogstService.getById(ctx.params.id);
};

getOogstplaatsById.validationScheme = {
params: Joi.object({
  id: Joi.number().integer().positive(),
}),
}

getFruitsoortenByOogstplaatsId = async (ctx) => {
  ctx.body = await oogstService.getFruitsoortenByOogstplaatsId(ctx.params.id);
}

getFruitsoortenByOogstplaatsId.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  }

const createOogstplaats =  async (ctx) => {
    const newOogstplaats = await oogstService.create({
      ...ctx.request.body
    });
    ctx.status = 201;
    ctx.body = newOogstplaats;
  };

createOogstplaats.validationScheme = {
  body: {
    naam: Joi.string(),
    breedtegraad: Joi.number().positive().precision(4).invalid(0),
    lengtegraad: Joi.number().positive().precision(4).invalid(0),
    oppervlakteInHectaren: Joi.number().positive().precision(2).invalid(0),
  },
}

  
const updateOogstplaats = async (ctx) => {
  ctx.body = await oogstService.updateById(ctx.params.id,
  {...ctx.request.body});
};
  
updateOogstplaats.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  body: {
    naam: Joi.string(),
    breedtegraad: Joi.number().positive().precision(4).invalid(0),
    lengtegraad: Joi.number().positive().precision(4).invalid(0),
    oppervlakteInHectaren: Joi.number().positive().precision(2).invalid(0),
  },
};
const deleteOogstplaats = async (ctx) => {
    oogstService.deleteById(Number(ctx.params.id));
    ctx.status = 204;
  };

deleteOogstplaats.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
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

  router.get('/', 
      validate(getAllOogstplaatsen.validationScheme),
      getAllOogstplaatsen);
  router.get('/:id', 
      validate(getOogstplaatsById.validationScheme),
      getOogstplaatsById);
  router.get('/:oogstplaatsid/fruitsoorten',
      validate(getFruitsoortenByOogstplaatsId.validationScheme),
      getFruitsoortenByOogstplaatsId)
  router.post('/', 
      validate(createOogstplaats.validationScheme),
      createOogstplaats);
  router.put('/:id', 
      validate(updateOogstplaats.validationScheme),
      updateOogstplaats);
  router.delete('/:id', 
      validate(deleteOogstplaats.validationScheme),
      deleteOogstplaats);

  app.use(router.routes())
     .use(router.allowedMethods());
};
