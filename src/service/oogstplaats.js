const oogstData = require('../data/oogstplaats');

const getAll = async () => {
    const {count, rows} = await oogstData.findAll();
    console.log(count,rows)
    
    return {
      count,
      rows,
    };
  };

  const getById = async (id) => {
    return await oogstData.findById(id);
    
  }

  const create = async({ naam, breedtegraad, lengtegraad, oppervlakteInHectaren }) => {
    return await oogstData.create(naam, breedtegraad, lengtegraad, oppervlakteInHectaren);
  };

  const updateById = async(id, {naam, breedtegraad, lengtegraad, oppervlakteInHectaren} ) => {
    return await oogstData.updateById(id,naam,breedtegraad,lengtegraad,oppervlakteInHectaren);
  }

  const deleteById = async(id) => {
    await oogstData.deleteById(id);
  }

  module.exports = {
    getAll,
    create,
    getById,
    updateById,
    deleteById,
  }