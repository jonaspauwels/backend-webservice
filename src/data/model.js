const { DataTypes}  = require('sequelize');



const initializeModel = async (sequelize) => {
    //tabellen aanmaken
    const fruitsoort = sequelize.define('Fruitsoort', {
        id: {type: DataTypes.INTEGER, autoIncrement:true,primaryKey:true},
        naam: {type: DataTypes.STRING, allowNull:false},
        variëteit: {type: DataTypes.STRING, allowNull:false},
        prijsper100kg:{type: DataTypes.FLOAT, allowNull:true},
        oogstplaats: {type: DataTypes.INTEGER, allowNull:false,
            references: {
                model: 'Oogstplaats',
                key: 'id'
            }
        },
        
    });
    const koelcel = sequelize.define('Koelcel', {
        id: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        capaciteit: {type: DataTypes.FLOAT, allowNull: false}
    });


    const HoeveelheidPerKoelcel = sequelize.define('HoeveelheidPerKoelcel',{
        hoeveelheid: {type: DataTypes.INTEGER, allowNull:false}
    })

    const oogstplaats = sequelize.define('Oogstplaats',{
        id: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        naam: {type: DataTypes.STRING, allowNull:false},
        breedtegraad: {type: DataTypes.FLOAT, allowNull: false},
        lengtegraad: {type: DataTypes.FLOAT, allowNull:false},
        oppervlakteInHectaren: {type: DataTypes.FLOAT, allowNull:false}
    });

    

    const behandeling = sequelize.define('Behandeling', {
        hoeveelheid: {type: DataTypes.FLOAT, allowNull: false},
        startdatum: {type: DataTypes.DATE, allowNull: false},
        einddatum: {type: DataTypes.DATE, allowNull: false}
    })

    const product = sequelize.define('Product', {
        id: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        naam : {type:DataTypes.STRING, allowNull: false},
        beschrijving: {type: DataTypes.STRING, allowNull:false}
    });

    //associaties leggen
    fruitsoort.belongsTo(oogstplaats);
    oogstplaats.hasMany(fruitsoort);

    fruitsoort.belongsToMany(koelcel, { through: HoeveelheidPerKoelcel});
    koelcel.belongsToMany(fruitsoort, { through: HoeveelheidPerKoelcel});

    koelcel.belongsToMany(product, { through: behandeling });
    product.belongsToMany(koelcel, { through: behandeling });

    //TODO: check if this is necessary!!
    //synchronizeren met database
    //await sequelize.sync({ alter: true })
    return sequelize;
    
    
}


module.exports = {
    initializeModel,
}