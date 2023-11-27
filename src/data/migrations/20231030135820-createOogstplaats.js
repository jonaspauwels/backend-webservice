
module.exports = {
   up: async ( queryInterface, Sequelize) => {
    await queryInterface.createTable('oogstplaats', {
      id: {type: Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
        naam: {type: Sequelize.STRING, allowNull:false},
        breedtegraad: {type: Sequelize.FLOAT, allowNull: false},
        lengtegraad: {type: Sequelize.FLOAT, allowNull:false},
        oppervlakteInHectaren: {type: Sequelize.FLOAT, allowNull:false}
    });
  },

down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('oogstplaats');
  }
}
