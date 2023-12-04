
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBerror');
const { hashPassword, verifyPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const Role = require('../core/roles');
const { getLogger } = require('../core/logging');
const { getSequelize } = require('../data');

const checkAndParseSession = async (authHeader) => {
  //indien geen header aanwezig, fout gooien
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  } 
  //indien header niet met 'Bearer' start, fout gooien
  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }
  // 'Bearer verwijderen van het token'
  const authToken = authHeader.substring(7);
  try {
    const { roles, userId } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  } 
};

const checkRole = (role, roles) => {
  //kijk na of de rol voorkomt in de array van rollen
  const hasPermission = roles.includes(role);

  //indien niet: fout gooien
  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application'
    );
  }
};

const makeExposedUser = ({ id, naam, email, roles }) => ({
  id,
  naam,
  email,
  roles,
});

const makeLoginData = async (user) => {

  const token = await generateJWT(user)
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await getByEmail(email); 

  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  const passwordValid = await verifyPassword(password, user[0].dataValues.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  return await makeLoginData(user[0]);
};

const getAll = async () => {
    const { count, rows } = await getSequelize().models.User.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
        }); 
    
    users = []
    for (user of rows) {
      users.push(makeExposedUser(user))
    }
      
    return {count,users, };
};

const getById = async (id) => {
    const [user] = await getSequelize().models.User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: {
          id: id
      }
    });
    if (!user) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
    return makeExposedUser(user);
  };

const getByEmail = async (email) => {
  return  await getSequelize().models.User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      email: email
    }
  });
};

const register = async ({ naam, email, password }) => {
    
    try {
      const passwordHash = await hashPassword(password);
    
      const user = await getSequelize().models.User.create({
          naam, 
          email,
          password_hash: passwordHash,
          roles: JSON.stringify(Role.USER)
      });
      return await makeLoginData(user);
      } catch (error){
          getLogger().error('Error during create', { error, });
          throw handleDBError(error);
      }
  };

const updateById = async (id, { naam, email, password }) => {
    const [user] = await getSequelize().models.User.findAll({
        where: {
            id: id
        }
      });
      if (!user) {
        throw ServiceError.notFound(`No user with id ${id} exists`, { id });
      }
  
    try {
        const passwordHash = await hashPassword(password);
        await getSequelize().models.User.update({
            naam, 
            email,
            password_hash: passwordHash,
            roles: JSON.stringify(Role.USER)
            },{
            where: {id:id}
        });
        return await getById(id);
        } catch (error){
            getLogger().error('Error during updateBy', { error, });
            throw handleDBError(error);
        }
};

/**
 * Delete an existing user.
 *
 * @param {number} id - Id of the user to delete.
 */
const deleteById = async (id) => {
    try{
        const rowsDeleted = await getSequelize().models.User.destroy({
            where:{id: id}
        })
        if (!rowsDeleted>0){
          throw ServiceError.notFound(`No user with id ${id} exists`, { id })
          }; 
        } catch (error) {
            getLogger().error('Error during deleteById', { error, });
            throw handleDBError(error);
        }
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  register,
  updateById,
  deleteById,
  login,
  checkAndParseSession,
  checkRole,
};
