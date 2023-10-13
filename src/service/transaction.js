let { FRUITSOORTEN } = require('../data/mock_data');

const getAll = () => {
    return { items: FRUITSOORTEN, count: FRUITSOORTEN.length };
  };
  
  const getById = (id) => {
    throw new Error('Not implemented yet!');
  };
  
  const create = ({ naam, variëteit, prijsper100kg, oogstplaats }) => {
    throw new Error('Not implemented yet!');
  };
  
  const updateById = (id, { naam, variëteit, prijsper100kg, oogstplaats }) => {
    throw new Error('Not implemented yet!');
  };
  
  const deleteById = (id) => {
    throw new Error('Not implemented yet!');
  };
  
  module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
  };