const { getSequelize } = require("../data/index");


const findAll = async()=> {
     const oogstplaatsen = await getSequelize().models.Oogstplaats
     return oogstplaatsen;
}

const create = async( name, latitude, longitude ) => {
    console.log(name)
    const item = getSequelize().models.Oogstplaats.build({
        naam: name, 
        breedtegraad: latitude,
        lengtegraad: longitude
    });
    console.log(item)
    await item.save()
    return item.id;
}

 module.exports = {
     findAll,
     create,
 };