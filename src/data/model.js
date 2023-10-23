const { DataTypes}  = require('sequelize');



const initializeModel = async (sequelize) => {
    sequelize.define('Fruitsoort', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        naam: {
            type: DataTypes.STRING,
            allowNull:false
        },
        variëteit: {
            type: DataTypes.STRING,
            allowNull:false
        },
        prijsper100kg:{
            type: DataTypes.FLOAT,
            allowNull:true
        },
        oogstplaats: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {
                model: 'Oogstplaats',
                key: 'id'
            }
        },
        
    })

    sequelize.define('Oogstplaats',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        naam: {
            type: DataTypes.STRING,
            allowNull:false
        },
        breedtegraad: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        lengtegraad: {
            type: DataTypes.FLOAT,
            allowNull:false
        }
    })

    sequelize.define('Koelcel', {
        capaciteit: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    })

    sequelize.define('Product', {
        naam : {
            type:DataTypes.STRING,
            allowNull: false
        },
        beschrijving: {
            type: DataTypes.STRING,
            allowNull:false
        }
    })

    return sequelize;
    //TODO: check if this is necessary!!
    //await sequelize.sync({ alter: true })
}


module.exports = {
    initializeModel,
}