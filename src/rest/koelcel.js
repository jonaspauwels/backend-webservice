const Router = require('@koa/router');
const koelService = require('../service/koelcel');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication ,makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAllKoelcellen = async (ctx) => {
    ctx.body = await koelService.getAll();
};

getAllKoelcellen.validationScheme = null;

const getKoelcelById = async (ctx) => {
    ctx.body = await koelService.getById(ctx.params.id);
};

getKoelcelById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive(),
      }),
}

const getFruitsoortenByKoelcelId = async (ctx) => {
    ctx.body = await koelService.getFruitsoortenByKoelcelId(ctx.params.koelcelId);
};

getFruitsoortenByKoelcelId.validationScheme = {
    params: Joi.object({
        koelcelId: Joi.number().integer().positive(),
      }),
};

const createKoelcel = async (ctx) => {
    ctx.body = await koelService.create({
        ...ctx.request.body
    });
    ctx.status = 201;
};

createKoelcel.validationScheme = {
    body: {
        capaciteit: Joi.number().integer().positive(),
    },
};

const updateKoelcel = async (ctx) => {
    ctx.body = await koelService.updateById(ctx.params.id,
        {...ctx.request.body});
};

updateKoelcel.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
    body: {
        capaciteit: Joi.number().positive().precision(4),
    }
};

const deleteKoelcel = async (ctx) => {
    await koelService.deleteById(ctx.params.id);
    ctx.status = 204
};

deleteKoelcel.validationScheme = {
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
      prefix: '/koelcellen',
    });

    const requireAdmin = makeRequireRole(Role.ADMIN);

  // enkel ingelogde users kunnen koelcel info opvragen, enkel ADMIN kan hier wijzigingen aanbrengen
  
    router.get('/', 
        requireAuthentication,
        validate(getAllKoelcellen.validationScheme),
        getAllKoelcellen);    
    router.get('/:id', 
        requireAuthentication,
        validate(getKoelcelById.validationScheme),
        getKoelcelById);
    router.get('/:koelcelId/fruitsoorten',
        requireAuthentication,
        validate(getFruitsoortenByKoelcelId.validationScheme),
        getFruitsoortenByKoelcelId);
    router.post('/', 
        requireAuthentication, requireAdmin, 
        validate(createKoelcel.validationScheme),
        createKoelcel);
    router.put('/:id', 
        requireAuthentication, requireAdmin, 
        validate(updateKoelcel.validationScheme),
        updateKoelcel);
    router.delete('/:id', 
        requireAuthentication, requireAdmin, 
        validate(deleteKoelcel.validationScheme),
        deleteKoelcel);
  
    app.use(router.routes())
       .use(router.allowedMethods());
  };
  