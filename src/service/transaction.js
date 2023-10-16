let { FRUITSOORTEN, OOGSTPLAATSEN } = require('../data/mock_data');

const getAll = () => {
    return { items: FRUITSOORTEN, count: FRUITSOORTEN.length };
  };
  
  const getById = (id) => {
    return FRUITSOORTEN.find((f)=> f.id === id);
  };
  
  const create = ({ naam, variëteit, prijsper100kg, oogstplaats }) => {
    let bestaandeOogstplaats;
    if (oogstplaats) {
        bestaandeOogstplaats = OOGSTPLAATSEN.find((o)=> o.id === oogstplaats);
        if (!bestaandeOogstplaats) {
            throw new Error(`oogstplaats met id ${oogstplaats} bestaat niet.`)
        }
    };

    const maxId = Math.max(...FRUITSOORTEN.map((f)=>f.id));

    const newTransaction = {
        id: maxId+1,
        naam,
        variëteit,
        prijsper100kg,
        oogstplaats: bestaandeOogstplaats,
    };

    FRUITSOORTEN.push(newTransaction);
    return newTransaction;
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