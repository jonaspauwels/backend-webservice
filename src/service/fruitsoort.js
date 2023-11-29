const { getSequelize } = require("./index");
const { getLogger } = require("../core/logging")
const oogstplaatsService = require('./oogstplaats')
const koelcelService = require('./koelcel')

const getAll = async () => {
    const { count, rows } = await getSequelize().models.Fruitsoort.findAndCountAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
   });
    
    return {count,rows,};
  };
  
  const getById = async (id) => {
    const fruitsoort = await getSequelize().models.Fruitsoort.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: {
          id: id
      }
  });

    if (!fruitsoort){
      throw Error(`No fruitsoort with id ${id} exists`, { id });
    }
    return fruitsoort;
  };

  const getKoelcellenByFruitsoortId = async (id) => {
    const koelcellen = await getSequelize().models.Oogstplaats.findAll({
      include: getSequelize().models.Koelcel,
      where: {
          id: id
      }
  });

    if (!koelcellen){
      throw Error(`No fruitsoort with id ${id} exists`, { id });
    }
    return koelcellen;
  }
  
  const create = async({ naam, variëteit, prijsper100kg, OogstplaatId }) => {
  
    const bestaandeOogstplaats =  oogstplaatsService.getById(OogstplaatId)

    if (!bestaandeOogstplaats) {
      throw Error(`No oogstplaats with id ${OogstplaatId} exists`, { OogstplaatId });
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
          throw error;
      }
    

  };

  const createHoeveelheid = async (fruitId, koelcelId, { hoeveelheid }) => {
    const bestaandeFruitsoort = getById(fruitId);
    const bestaandeKoelcel = koelcelService.getById(koelcelId);

    if (!bestaandeFruitsoort) {
      throw Error(`No fruitsoort with id ${fruitId} exists`, { fruitId });
    }
    if (!bestaandeKoelcel) {
      throw Error(`No koelcel with id ${koelcelId} exists`, { koelcelId });
    }

    try {
      const nieuweHoeveelheid = await getSequelize().models.HoeveelheidPerKoelcel.create({
          FruitsoortId: fruitId,
          KoelcelId: koelcelId,
          hoeveelheid,
      });
      return nieuweHoeveelheid;
      } catch (error) {
          getLogger().error('Error during createHoeveelheid', { error, });
          throw error;
      }


  }

  const updateHoeveelheid = async ( fruitId, koelcelId, { hoeveelheid }) => {
    const bestaandeFruitsoort = getById(fruitId);
    const bestaandeKoelcel = koelcelService.getById(koelcelId);

    if (!bestaandeFruitsoort) {
      throw Error(`No fruitsoort with id ${fruitId} exists`, { fruitId });
    }
    if (!bestaandeKoelcel) {
      throw Error(`No koelcel with id ${koelcelId} exists`, { koelcelId });
    }

    try {
      const aangepasteHoeveelheid = await getSequelize().models.HoeveelheidPerKoelcel.update({
          hoeveelheid,
          },{
              where: {
                  FruitsoortId: fruitId,
                  KoelcelId: koelcelId
              }
          });
      return aangepasteHoeveelheid;
      } catch (error) {
          getLogger().error('Error during updateHoeveelheid', { error, });
          throw error;
      }
  };
  
  const updateById = async (id, { naam, variëteit, prijsper100kg, OogstplaatId }) => {
   if (OogstplaatId) {
    const bestaandeOogstplaats = await oogstplaatsService.getById(OogstplaatId);

    if (!bestaandeOogstplaats) {
      throw Error(`No oogstplaats with id ${OogstplaatId} exists`, { OogstplaatId });
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
    return getById(id);
    } catch (error){
        getLogger().error('Error during updateById', { error, });
        throw error;
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
      throw Error(`No fruitsoort with id ${fruitId} exists`, { fruitId });
    }
    } catch (error) {
        getLogger().error('Error during deleteById', { error, });
        throw error;
    } 
};
  
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