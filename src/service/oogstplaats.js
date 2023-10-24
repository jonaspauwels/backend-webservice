const oogstRepo = require('../repository/oogstplaats');

const getAll = async () => {
    const items = await oogstRepo.findAll();
    return {
      items,
      count: items.count,
    };
  };

  const create = async({ naam, breedtegraad, lengtegraad }) => {
    
    const nieuweOogstplaats = await oogstRepo.create(naam, breedtegraad, lengtegraad)

    return nieuweOogstplaats;
  };

  module.exports = {
    getAll,
    create,
  }