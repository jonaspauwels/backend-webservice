const { getSequelize } = require("../data");
const { getLogger } = require("../core/logging");
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBerror');

const getAll = async () => {
  const { count, rows } = await getSequelize().models.Koelcel.findAndCountAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });

  return {count,rows, };
};

const getById = async (id) => {
    const [koelcel] = await getSequelize().models.Koelcel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: {
          id: id
      }
    });

    if (!koelcel) {
      throw ServiceError.notFound(`No koelcel with id ${id} exists`, { id });
    }
    
    return koelcel;
  };

const getFruitsoortenByKoelcelId = async (id) => {
  const [fruitsoorten] = await getSequelize().models.Koelcel.findAll({
    include: getSequelize().models.Fruitsoort,
    where: {id:id}
  });

  if (!fruitsoorten) {
    throw ServiceError.notFound(`No koelcel with id ${id} exists`, { id });
  }
  return fruitsoorten;
};

const create = async ({ capaciteit }) => {
    try {
      const koelcel = await getSequelize().models.Koelcel.create({
        capaciteit,
      });
      return koelcel
    } catch (error) {
          getLogger().error('Error during create', { error, });
          throw handleDBError(error);
    }
  };

const updateById = async (id, { capaciteit }) => {
  try {
    await getSequelize().models.Koelcel.update({
      capaciteit
    },{
      where: {id:id}
    });
    return await getById(id);
  } catch (error) {
    getLogger().error('Error during updateBy', { error, });
          throw handleDBError(error);
  }
};

const deleteById = async(id) => {
  try {
    const rowsDeleted = await getSequelize().models.Koelcel.destroy({
      where:{id: id}
    })
    if (!rowsDeleted>0){
      throw ServiceError.notFound(`No koelcel with id ${id} exists`, { id })
    } ;
  } catch (error) {
      getLogger().error('Error during deleteById', { error, });
      throw handleDBError(error);
  }
}

module.exports = {
    getAll,
    getById,
    getFruitsoortenByKoelcelId,
    create,
    updateById,
    deleteById,
}