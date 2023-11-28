const { getSequelize } = require("./index");


const findAll = async()=> {
     const fruitsoorten = await getSequelize().models.Fruitsoort
     return fruitsoorten;
}

const create = async( naam, variëteit, prijsper100kg, oogstplaats ) => {
    const item = getSequelize().models.Fruitsoort.build({
        naam: naam, 
        variëteit: variëteit,
        prijsper100kg: prijsper100kg,
        oogstplaats:oogstplaats
    });
    await item.save()
    return item.id;
}

 module.exports = {
     findAll,
     create,
 };

