const { DataTypes}  = require('sequelize');

const initializeModel = async (sequelize) => {
    //tabellen aanmaken
    const fruitsoort = sequelize.define('Fruitsoort', {
        id: {type: DataTypes.INTEGER, autoIncrement:true,primaryKey:true},
        naam: {type: DataTypes.STRING, allowNull:false},
        variëteit: {type: DataTypes.STRING, allowNull:false},
        prijsper100kg:{type: DataTypes.FLOAT, allowNull:true},       
    });
    const koelcel = sequelize.define('Koelcel', {
        id: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        capaciteit: {type: DataTypes.FLOAT, allowNull: false}
    });


    const HoeveelheidPerKoelcel = sequelize.define('HoeveelheidPerKoelcel',{
        hoeveelheid: {type: DataTypes.INTEGER, allowNull:false}
    });

    const oogstplaats = sequelize.define('Oogstplaats',{
        id: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        naam: {type: DataTypes.STRING, allowNull:false, unique:'idx_oogstplaats_naam_unique'},
        breedtegraad: {type: DataTypes.FLOAT, allowNull: false},
        lengtegraad: {type: DataTypes.FLOAT, allowNull:false},
        oppervlakteInHectaren: {type: DataTypes.FLOAT, allowNull:false}
    });

    sequelize.define('User', {
        id: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        naam: {type: DataTypes.STRING, allowNull:false},
        email: {type: DataTypes.STRING, allowNull:false, unique:'idx_user_email_unique'},
        password_hash: {type: DataTypes.STRING, allowNull:false},
        roles: {type: DataTypes.JSON, allowNull: false}
    });

    //associaties leggen
    fruitsoort.belongsTo(oogstplaats);
    oogstplaats.hasMany(fruitsoort);

    fruitsoort.belongsToMany(koelcel, { through: HoeveelheidPerKoelcel});
    koelcel.belongsToMany(fruitsoort, { through: HoeveelheidPerKoelcel});

    //synchronizeren met database
    await sequelize.sync({ alter: true })
    return sequelize;
}

module.exports = {
    initializeModel,
}