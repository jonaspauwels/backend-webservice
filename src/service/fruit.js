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

    const newFruit= {
        id: maxId+1,
        naam,
        variëteit,
        prijsper100kg,
        oogstplaats,
    };

    FRUITSOORTEN.push(newFruit);
    return newFruit;
  };
  
  const updateById = (id, { naam, variëteit, prijsper100kg, oogstplaats }) => {
    let teUpdatenFruitsoort = FRUITSOORTEN.find((f)=> f.id===id);
    console.log(teUpdatenFruitsoort)
    if (!teUpdatenFruitsoort)
      throw new Error(`Fruitsoort met id ${id} bestaat niet.`);
    teUpdatenFruitsoort.naam = naam;
    teUpdatenFruitsoort.variëteit = variëteit;
    teUpdatenFruitsoort.prijsper100kg = prijsper100kg;
    teUpdatenFruitsoort.oogstplaats = oogstplaats;
    return teUpdatenFruitsoort;
};
  
const deleteById = (id) => {
  const teDeletenFruitsoort = FRUITSOORTEN.find((f)=> f.id===id);
  if (!teDeletenFruitsoort)
    throw new Error(`Fruitsoort met id ${id} bestaat niet.`);
  const index = FRUITSOORTEN.indexOf(teDeletenFruitsoort)
  return FRUITSOORTEN.splice(index, 1)

};
  
  module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
  };