const oogstData = require('../data/oogstplaats');

const getAll = async () => {
    const items = await oogstData.findAll();
    return {
      items,
      count: items.length,
    };
  };

  const getById = async (id) => {
    return await oogstData.findById(id)
    
  }

  const create = async({ naam, breedtegraad, lengtegraad, oppervlakteInHectaren }) => {
    return await oogstData.create(naam, breedtegraad, lengtegraad, oppervlakteInHectaren)
  };

  const updateById = async(id, {naam, breedtegraad, lengtegraad, oppervlakteInHectaren} ) => {
    return await oogstData.updateById(id,naam,breedtegraad,lengtegraad,oppervlakteInHectaren);
  }

  module.exports = {
    getAll,
    create,
    getById,
    updateById,
  }