const { getSequelize } = require('../data');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBerror');


const getAll = async () => {
    const { count, rows } = await getSequelize().models.Oogstplaats.findAndCountAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
      }); 
    
    return {count,rows, };
  };

  const getById = async (id) => {
    const [oogstplaats] = await getSequelize().models.Oogstplaats.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: {
          id: id
      }
    });
    if (!oogstplaats) {
      throw ServiceError.notFound(`No oogstplaats with id ${id} exists`, { id });
    }
    return oogstplaats;
  };

  const getFruitsoortenByOogstplaatsId = async (id) => {
    const [fruitsoorten] = await getSequelize().models.Oogstplaats.findAll({
      include: getSequelize().models.Fruitsoort,
      where: {id: id}
      })

    if (!fruitsoorten) {
      throw ServiceError.notFound(`No oogstplaats with id ${id} exists`, { id });
     }
    return fruitsoorten;
  };

  const create = async ({ naam, breedtegraad, lengtegraad, oppervlakteInHectaren }) => {
    try {
      const oogstplaats = await getSequelize().models.Oogstplaats.create({
          naam, 
          breedtegraad,
          lengtegraad,
          oppervlakteInHectaren
      });
      return oogstplaats;
      } catch (error){
          getLogger().error('Error during create', { error, });
          throw handleDBError(error);
      }
  };

  const updateById = async (id, {naam, breedtegraad, lengtegraad, oppervlakteInHectaren} ) => {
    const [oogstplaats] = await getSequelize().models.Oogstplaats.findAll({
      where: {
          id: id
      }
    });
    if (!oogstplaats) {
      throw ServiceError.notFound(`No oogstplaats with id ${id} exists`, { id });
    }
  
    try {
      await getSequelize().models.Oogstplaats.update({
        naam,
        breedtegraad,
        lengtegraad,
        oppervlakteInHectaren
          },{
          where: {id:id}
      });
      return await getById(id);
      } catch (error){
          getLogger().error('Error during updateBy', { error, });
          throw handleDBError(error);
      }
  }

  const deleteById = async (id) => {
    try{
      const rowsDeleted = await getSequelize().models.Oogstplaats.destroy({
          where:{id: id}
      })
      if (!rowsDeleted>0){
        throw ServiceError.notFound(`No oogstplaats with id ${id} exists`, { id })
        }; 
      } catch (error) {
          getLogger().error('Error during deleteById', { error, });
          throw handleDBError(error);
      }
  }

  module.exports = {
    getAll,
    getById,
    getFruitsoortenByOogstplaatsId,
    create,
    updateById,
    deleteById,
  }