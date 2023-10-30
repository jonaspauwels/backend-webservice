const oogstplaats = require("../rest/oogstplaats");
const { getSequelize } = require("./index");


const findAll = async()=> {
    return await getSequelize().models.Oogstplaats.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
     
}

const findById = async(id) => {
    return await getSequelize().models.Oogstplaats.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
            id: id
        }
    })
}

const create = async( name,breedtegraad, lengtegraad,  oppervlakte ) => {
    const item = await getSequelize().models.Oogstplaats.create({
        naam: name, 
        breedtegraad: breedtegraad,
        lengtegraad: lengtegraad,
        oppervlakteInHectaren: oppervlakte
    });
    return item.id;
}

const updateById = async( id, naam, breedtegraad, lengtegraad, oppervlakte) => {
    const updatedItem = await getSequelize().models.Oogstplaats.update({
      naam,
      breedtegraad,
      lengtegraad,
      oppervlakteInHectaren:oppervlakte
    },{
        where: {
          id:id
        }
    });
    return updatedItem;
}

const deleteById = async (id) => {
    await getSequelize().models.Oogstplaats.destroy({
        where:{
            id: id
        }
    })
}

 module.exports = {
     findAll,
     create,
     findById,
     updateById,
     deleteById,
 };