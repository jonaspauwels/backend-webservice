const { getSequelize } = require("./index");
const { getLogger } = require("../core/logging")

const findAll = async()=> {
     return await getSequelize().models.Fruitsoort.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
     });
}

const findById = async (id) => {
    return await getSequelize().models.Fruitsoort.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
            id: id
        }
    });
};

const findKoelcellenByFruitsoortId = async (id) => {
    return await getSequelize().models.Oogstplaats.findAll({
        include: {Koelcel},
        where: {
            id: id
        }
    });
};

const create = async( naam, variëteit, prijsper100kg, OogstplaatId ) => {
    try {
    const fruitsoort = await getSequelize().models.Fruitsoort.create({
        naam, 
        variëteit,
        prijsper100kg,
        OogstplaatId,
    });
    return fruitsoort;
    } catch (error) {
        getLogger().error('Error during create', { error, });
        throw error;
    }
};

const createHoeveelheid = async( fruitId, koelcelId, hoeveelheid ) => {
    try {
    const item = await getSequelize().models.HoeveelheidPerKoelcel.create({
        FruitsoortId: fruitId,
        KoelcelId: koelcelId,
        hoeveelheid,
    });
    return item;
    } catch (error) {
        getLogger().error('Error during createHoeveelheid', { error, });
        throw error;
    }
}

const updateHoeveelheid = async( fruitId, koelcelId, hoeveelheid ) => {
    try {
    const item = await getSequelize().models.HoeveelheidPerKoelcel.update({
        hoeveelheid,
        },{
            where: {
                FruitsoortId: fruitId,
                KoelcelId: koelcelId
            }
        });
    return item;
    } catch (error) {
        getLogger().error('Error during updateHoeveelheid', { error, });
        throw error;
    }
}

const updateById = async (id, naam, variëteit, prijsper100kg, oogstplaatId) => {
    try {
    const item = await getSequelize().models.Fruitsoort.update({
        naam, 
        variëteit,
        prijsper100kg,
        oogstplaatId,
    },{
        where: {
            id:id
        }
    });
    return item;
    } catch (error){
        getLogger().error('Error during updateById', { error, });
        throw error;
    }
}

const deleteById = async (id) => {
    try {
    const rowsDeleted = await getSequelize().models.Fruitsoort.destroy({
        where: {
            id: id
        }
    })
    return rowsDeleted;
    } catch (error) {
        getLogger().error('Error during deleteById', { error, });
        throw error;
    }
}

 module.exports = {
     findAll,
     findById,
     findKoelcellenByFruitsoortId,
     create,
     createHoeveelheid,
     updateHoeveelheid,
     updateById,
     deleteById,
 };

