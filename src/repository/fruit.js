const { getSequelize } = require("../data/index");


const findAll = async()=> {
     const fruitsoorten = await getSequelize().models.Fruitsoort
     return fruitsoorten;
}

const create = async( name, variety, priceper100kg, harvestplace ) => {
    console.log(name)
    const item = getSequelize().models.Fruitsoort.build({
        naam: name, 
        variëteit: variety,
        prijsper100kg: priceper100kg,
        oogstplaats:harvestplace
    });
    console.log(item)
    await item.save()
    return item.id;
}

 module.exports = {
     findAll,
     create,
 };

