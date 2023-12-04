const { getSequelize } = require("../data");
const { getLogger } = require("../core/logging")
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBerror');
const oogstplaatsService = require('./oogstplaats')
const koelcelService = require('./koelcel');
const { Op } = require("sequelize");

const getAll = async () => {
    const { count, rows } = await getSequelize().models.Fruitsoort.findAndCountAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
   });
    
    return {count,rows,};
  };
  
  const getById = async (id) => {
    const [fruitsoort] = await getSequelize().models.Fruitsoort.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: {
          id: id
      }
      
  });
    if (!fruitsoort){
      throw ServiceError.notFound(`No fruitsoort with id ${id} exists`, { id });
    }
    return fruitsoort;
  };

  const getKoelcellenByFruitsoortId = async (id) => {
    const [koelcellen] = await getSequelize().models.Fruitsoort.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {model: getSequelize().models.Koelcel,
                attributes: {exclude: ['createdAt', 'updatedAt'],
                },
                },
      where: {
          id: id
      }
  });

    if (!koelcellen){
      throw ServiceError.notFound(`No fruitsoort with id ${id} exists`, { id });
    }
    return koelcellen;
  }
  
  const create = async({ naam, variëteit, prijsper100kg, OogstplaatId }) => {
  
    const bestaandeOogstplaats =  await oogstplaatsService.getById(OogstplaatId)

    if (!bestaandeOogstplaats) {
      throw ServiceError.notFound(`No oogstplaats with id ${OogstplaatId} exists`, { OogstplaatId });
    }

    try {
      const fruitsoort = await getSequelize().models.Fruitsoort.create({
          naam, 
          variëteit,
          prijsper100kg,
          OogstplaatId,
      });
      return fruitsoort;
      } catch (error) {
          getLogger().error('Error during create', { error, });
          throw handleDBError(error);
      }
    

  };

  const createHoeveelheid = async (fruitId, koelcelId, { hoeveelheid }) => {
    
    const bestaandeFruitsoort = await getById(fruitId);
    if (!bestaandeFruitsoort) {
      throw ServiceError.notFound(`No fruitsoort with id ${fruitId} exists`, { fruitId });
    }

    const bestaandeKoelcel = await koelcelService.getById(koelcelId);
    if (!bestaandeKoelcel) {
      throw ServiceError.notFound(`No koelcel with id ${koelcelId} exists`, { koelcelId });
    }

    const [bestaandeHoeveelheid] = await getSequelize().models.HoeveelheidPerKoelcel.findAll({
      where : {
        FruitsoortId : fruitId,
        KoelcelId: koelcelId
      }
    })
    if (bestaandeHoeveelheid) {
      throw ServiceError.duplicateValues(`Match between koelcel ${koelcelId} and fruitsoort ${fruitId} already exists, please use update (PUT).`)
    }

    const freeCapacity = await evaluateCapacity(bestaandeKoelcel.dataValues.capaciteit, koelcelId, 'create');

    if (hoeveelheid > freeCapacity){
      throw ServiceError.exceededCapacity(`Hoeveelheid is groter dan capaciteit van koelcel ${koelcelId}`);
    };

    try {
      const nieuweHoeveelheid = await getSequelize().models.HoeveelheidPerKoelcel.create({
          FruitsoortId: fruitId,
          KoelcelId: koelcelId,
          hoeveelheid,
      });
      return nieuweHoeveelheid;
      } catch (error) {
          getLogger().error('Error during createHoeveelheid', { error, });
          throw handleDBError(error);
      }
  }

  const updateHoeveelheid = async ( fruitId, koelcelId, { hoeveelheid }) => {
    const bestaandeFruitsoort = await getById(fruitId);
    if (!bestaandeFruitsoort) {
      throw ServiceError.notFound(`No fruitsoort with id ${fruitId} exists`, { fruitId });
    }

    const bestaandeKoelcel = await koelcelService.getById(koelcelId);
    if (!bestaandeKoelcel) {
      throw ServiceError.notFound(`No koelcel with id ${koelcelId} exists`, { koelcelId });
    }

    const [bestaandeHoeveelheid] = await getSequelize().models.HoeveelheidPerKoelcel.findAll({
      where : {
        FruitsoortId : fruitId,
        KoelcelId: koelcelId
      }
    })
    if (!bestaandeHoeveelheid) {
      throw ServiceError.validationFailed(`Match between koelcel ${koelcelId} and fruitsoort ${fruitId} does not exists, please use create (POST).`)
    }

   

    freeCapacity = await evaluateCapacity(bestaandeKoelcel.dataValues.capaciteit, koelcelId, 'update', fruitId);

    if (hoeveelheid > freeCapacity){
      throw ServiceError.exceededCapacity(`Hoeveelheid is groter dan capaciteit van koelcel ${koelcelId}`);
    };

    try {
      await getSequelize().models.HoeveelheidPerKoelcel.update({
          hoeveelheid,
          },{
              where: {
                  FruitsoortId: fruitId,
                  KoelcelId: koelcelId
              }
          });
      const [aangepasteHoeveelheid] = await getSequelize().models.HoeveelheidPerKoelcel.findAll({
        where : {
          FruitsoortId: fruitId,
          KoelcelId: koelcelId,
        },
      });
      return aangepasteHoeveelheid;
      } catch (error) {
          getLogger().error('Error during updateHoeveelheid', { error, });
          throw handleDBError(error);
      }
  };
  
  const updateById = async (id, { naam, variëteit, prijsper100kg, OogstplaatId }) => {
   if (OogstplaatId) {
    const bestaandeOogstplaats = await oogstplaatsService.getById(OogstplaatId);

    if (!bestaandeOogstplaats) {
      throw ServiceError.notFound(`No oogstplaats with id ${OogstplaatId} exists`, { OogstplaatId });
    }
  }

  try {
    await getSequelize().models.Fruitsoort.update({
        naam, 
        variëteit,
        prijsper100kg,
        OogstplaatId,
    },{
        where: {
            id:id
        }
    });
    return await getById(id);
    } catch (error){
        getLogger().error('Error during updateById', { error, });
        throw handleDBError(error);
    }
};
  
const deleteById = async (id) => {
  try {
    const rowsDeleted = await getSequelize().models.Fruitsoort.destroy({
        where: {
            id: id
        }
    })
    if (!rowsDeleted>0){
      throw ServiceError.notFound(`No fruitsoort with id ${id} exists`, { id });
    }
    } catch (error) {
        getLogger().error('Error during deleteById', { error, });
        throw handleDBError(error);
    } 
};
  
const evaluateCapacity = async (capaciteit, koelcelId, method, ...fruitId) => {
  let filledQuantity;
  if (method==='create'){
      filledQuantity=await getSequelize().models.HoeveelheidPerKoelcel.findAll({
        attributes: [[getSequelize().fn('SUM', getSequelize().col('hoeveelheid')), 'hoeveelheid']],
        where: {KoelcelId: koelcelId}
      });
    };
  if (method==='update'){
    filledQuantity = await getSequelize().models.HoeveelheidPerKoelcel.findAll({
            attributes: [[getSequelize().fn('SUM', getSequelize().col('hoeveelheid')), 'hoeveelheid']],
            where: {KoelcelId: koelcelId,
                    FruitsoortId: {[Op.ne]: fruitId[0]}}
          });
    }
  
  
  return capaciteit - filledQuantity[0].dataValues.hoeveelheid;
}

  module.exports = {
    getAll,
    getById,
    getKoelcellenByFruitsoortId,
    create,
    createHoeveelheid,
    updateHoeveelheid,
    updateById,
    deleteById,
  };