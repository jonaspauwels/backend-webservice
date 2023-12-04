const Router = require('@koa/router');
const oogstService = require('../service/oogstplaats');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication ,makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

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
};

const getFruitsoortenByOogstplaatsId = async (ctx) => {
  ctx.body = await oogstService.getFruitsoortenByOogstplaatsId(ctx.params.oogstplaatsid);
};

getFruitsoortenByOogstplaatsId.validationScheme = {
  params: Joi.object({
    oogstplaatsid: Joi.number().integer().positive(),
  }),
  };

const createOogstplaats =  async (ctx) => {
  ctx.body = await oogstService.create({
      ...ctx.request.body
    });
    ctx.status = 201;
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
    await oogstService.deleteById(ctx.params.id);
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

  const requireAdmin = makeRequireRole(Role.ADMIN);

  // enkel ingelogde users kunnen oogstplaats info opvragen, enkel ADMIN kan hier wijzigingen aanbrengen
  router.get('/', 
      requireAuthentication,
      validate(getAllOogstplaatsen.validationScheme),
      getAllOogstplaatsen);
  router.get('/:id', 
      requireAuthentication,
      validate(getOogstplaatsById.validationScheme),
      getOogstplaatsById);
  router.get('/:oogstplaatsid/fruitsoorten',
      requireAuthentication,
      validate(getFruitsoortenByOogstplaatsId.validationScheme),
      getFruitsoortenByOogstplaatsId)
  router.post('/', 
      requireAuthentication, requireAdmin, 
      validate(createOogstplaats.validationScheme),
      createOogstplaats);
  router.put('/:id', 
      requireAuthentication, requireAdmin, 
      validate(updateOogstplaats.validationScheme),
      updateOogstplaats);
  router.delete('/:id', 
      requireAuthentication, requireAdmin, 
      validate(deleteOogstplaats.validationScheme),
      deleteOogstplaats);

  app.use(router.routes())
     .use(router.allowedMethods());
};
