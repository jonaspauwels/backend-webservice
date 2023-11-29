const fruitData = require('../data/fruitsoort');
const oogstplaatsService = require('./oogstplaats')
const koelcelService = require('./koelcel')

const getAll = async () => {
    const { count, rows } = await fruitData.findAll();
    
    return {
      count,
      rows,
    };
  };
  
  const getById = async (id) => {
    const fruitsoort = await fruitData.findById(id);

    if (!fruitsoort){
      throw Error(`No fruitsoort with id ${id} exists`, { id });
    }
    return fruitsoort;
  };

  const getKoelcellenByFruitsoortId = async (id) => {
    const koelcellen = await fruitData.findKoelcellenByFruitsoortId(id);

    if (!koelcellen){
      throw Error(`No fruitsoort with id ${id} exists`, { id });
    }
    return koelcellen;
  }
  
  const create = async({ naam, variëteit, prijsper100kg, oogstplaatId }) => {
    console.log(oogstplaatId)
    const bestaandeOogstplaats =  oogstplaatsService.getById(oogstplaatId)

    if (!bestaandeOogstplaats) {
      throw Error(`No oogstplaats with id ${oogstplaatId} exists`, { oogstplaatId });
    }
    return await fruitData.create(naam, variëteit,prijsper100kg,oogstplaatId)

  };

  const createHoeveelheid = async ({ fruitId, koelcelId, hoeveelheid }) => {
    const bestaandeFruitsoort = getById(fruitId);
    const bestaandeKoelcel = koelcelService.getById(koelcelId);

    if (!bestaandeFruitsoort) {
      throw Error(`No fruitsoort with id ${fruitId} exists`, { fruitId });
    }
    if (!bestaandeKoelcel) {
      throw Error(`No koelcel with id ${koelcelId} exists`, { koelcelId });
    }

    return await fruitData.createHoeveelheid( fruitId, koelcelId, hoeveelheid)

  }

  const updateHoeveelheid = async ({ fruitId, koelcelId, hoeveelheid }) => {
    const bestaandeFruitsoort = getById(fruitId);
    const bestaandeKoelcel = koelcelService.getById(koelcelId);

    if (!bestaandeFruitsoort) {
      throw Error(`No fruitsoort with id ${fruitId} exists`, { fruitId });
    }
    if (!bestaandeKoelcel) {
      throw Error(`No koelcel with id ${koelcelId} exists`, { koelcelId });
    }

    return await fruitData.updateHoeveelheid( fruitId, koelcelId, hoeveelheid)
  }
  
  const updateById = async (id, { naam, variëteit, prijsper100kg, oogstplaatsId }) => {
   if (oogstplaatsId) {
    const bestaandeOogstplaats = await oogstplaatsService.getById(oogstplaatsId);

    if (!bestaandeOogstplaats) {
      throw Error(`No oogstplaats with id ${oogstplaatsId} exists`, { oogstplaatsId });
    }
   }

   await fruitData.updateById(id, naam, variëteit, prijsper100kg, oogstplaatsId)
   return await getById(id)
};
  
const deleteById = async (id) => {
  const deleted = await fruitData.deleteById(id);
  if (!deleted>0){
    throw Error(`No fruitsoort with id ${fruitId} exists`, { fruitId });
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