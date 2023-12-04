const Router = require('@koa/router');
const fruitService = require('../service/fruitsoort');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication ,makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAllFruitsoorten = async (ctx) => {
  ctx.body = await fruitService.getAll();  
};

getAllFruitsoorten.validationScheme = null

const getFruitsoortById = async (ctx) => {
  ctx.body = await fruitService.getById(ctx.params.id);
};

getFruitsoortById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};
  
const getKoelcellenByFruitsoortId = async (ctx) => {
  ctx.body = await fruitService.getKoelcellenByFruitsoortId(ctx.params.fruitsoortId)
};

getKoelcellenByFruitsoortId.validationScheme = {
  params: Joi.object({
    fruitsoortId: Joi.number().integer().positive(),
  }),
};


const createFruitsoort =  async (ctx) => {
  ctx.body = await fruitService.create({
      ...ctx.request.body
    });
    ctx.status = 201;
  };

createFruitsoort.validationScheme = {
  body: {
    naam: Joi.string(),
    variëteit:Joi.string(),
    prijsper100kg: Joi.number().positive().precision(2).default(0),
    OogstplaatId: Joi.number().integer().positive(),
  }
}

const createHoeveelheid = async (ctx) => {
  ctx.body = await fruitService.createHoeveelheid(
      ctx.params.fruitsoortId, ctx.params.koelcelId, 
      {...ctx.request.body});
  ctx.status = 201
}

createHoeveelheid.validationScheme = {
  params: Joi.object({
    fruitsoortId: Joi.number().integer().positive(),
    koelcelId: Joi.number().integer().positive(),
  }),
  body: {
    hoeveelheid: Joi.number().integer().positive(),
  }
}
  
const updateHoeveelheid = async (ctx) => {
  ctx.body = await fruitService.updateHoeveelheid(
      ctx.params.fruitsoortId, ctx.params.koelcelId, 
      {...ctx.request.body});
};

updateHoeveelheid.validationScheme = {
  params: Joi.object({
    fruitsoortId: Joi.number().integer().positive(),
    koelcelId: Joi.number().integer().positive(),
  }),
  body: {
    hoeveelheid: Joi.number().integer().positive(),
  },
};

const updateFruitsoort = async (ctx) => {
    ctx.body = await fruitService.updateById(ctx.params.id,
    {...ctx.request.body});
  };

updateFruitsoort.validationScheme = {
    params: Joi.object({
      id: Joi.number().integer().positive(),
    }),
    body: {
      naam: Joi.string(),
      variëteit:Joi.string(),
      prijsper100kg: Joi.number().positive().precision(2).default(0),
      OogstplaatId: Joi.number().integer().positive()
    },
  };
  
const deleteFruitsoort = async (ctx) => {
    await fruitService.deleteById(ctx.params.id);
    ctx.status = 204;
  };

deleteFruitsoort.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
}

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/fruitsoorten',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  // enkel ingelogde users kunnen fruitsoort info opvragen of hoeveelheden wijzigen, enkel ADMIN kan wijziginen aanbrengen in fruitsoorten

  router.get('/',
    requireAuthentication,
    validate(getAllFruitsoorten.validationScheme),
    getAllFruitsoorten);
  router.get('/:id',
    requireAuthentication,
    validate(getFruitsoortById.validationScheme),
    getFruitsoortById);
  router.get('/:fruitsoortId/koelcellen',
    requireAuthentication,
    validate(getKoelcellenByFruitsoortId.validationScheme),
    getKoelcellenByFruitsoortId);
  router.post('/',
    requireAuthentication, requireAdmin,
    validate(createFruitsoort.validationScheme),
    createFruitsoort);
  router.post('/:fruitsoortId/koelcellen/:koelcelId',
    requireAuthentication,
    validate(createHoeveelheid.validationScheme),
    createHoeveelheid);
  router.put('/:fruitsoortId/koelcellen/:koelcelId',
    requireAuthentication,
    validate(updateHoeveelheid.validationScheme),
    updateHoeveelheid);
  router.put('/:id',
    requireAuthentication, requireAdmin,
    validate(updateFruitsoort.validationScheme),
    updateFruitsoort);
  router.delete('/:id',
    requireAuthentication, requireAdmin,
    validate(deleteFruitsoort.validationScheme),
    deleteFruitsoort);

  app.use(router.routes())
     .use(router.allowedMethods());
};
