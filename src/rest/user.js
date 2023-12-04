const Router = require('@koa/router');
const Joi = require('joi');
const userService = require('../service/user');
const validate = require('../core/validation');
const Role = require('../core/roles');
const { requireAuthentication ,makeRequireRole } = require('../core/auth');

const getAllUsers = async (ctx) => {
  ctx.body = await userService.getAll();
};
getAllUsers.validationScheme = null;

const getUserById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);

};
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const register = async (ctx) => {
    ctx.body = await userService.register({...ctx.request.body});
    ctx.status = 201;
  };
register.validationScheme = {
    body: {
      naam: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
    },
  };

const updateUserById = async (ctx) => {
  ctx.body = await userService.updateById(ctx.params.id, ctx.request.body);
};

updateUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string()
  },
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};


const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);
  ctx.body = token;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUserRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  router.post('/login',
  validate(login.validationScheme),
  login
  );
  router.post('/register',
  validate(register.validationScheme),
  register
  );

  const requireAdmin = makeRequireRole(Role.ADMIN);

  const checkUserId = (ctx, next) => {
    const { userId, roles } = ctx.state.session;
    const { id } = ctx.params;
  
    // You can only get your own data unless you're an admin
    if (id !== userId && !roles.includes(Role.ADMIN)) {
      return ctx.throw(
        403,
        "You are not allowed to view this user's information",
        {
          code: 'FORBIDDEN',
        }
      );
    }
    return next();
  };

  router.get('/',
    requireAuthentication, requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );
  router.get('/:id',
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById
  );

  router.put('/:id',
    requireAuthentication,
    validate(updateUserById.validationScheme),
    checkUserId,
    updateUserById
  );
  router.delete('/:id',
    requireAuthentication,
    validate(deleteUserById.validationScheme),
    checkUserId,
    deleteUserById
  );

    

  app.use(router.routes()).use(router.allowedMethods());
};
