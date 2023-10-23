const { DataTypes } = require('sequelize')

const initializeModel = (sequelize) => {
    const fruitsoort = sequelize.define('Fruitsoort', {
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
            allowNull:false
        }
    })

    oogstplaats = sequelize.define('Oogstplaats',{
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

    const koelcel = sequelize.define('Koelcel', {
        capaciteit: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    })

    const product = sequelize.define('Product', {
        naam : {
            type:DataTypes.STRING,
            allowNull: false
        },
        beschrijving: {
            type: DataTypes.STRING,
            allowNull:false
        }
    })

    
}


module.exports = {
    initializeModel,
}