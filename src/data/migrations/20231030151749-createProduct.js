
module.exports = {

  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable('products', {
      id: {type: Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
        naam : {type:Sequelize.STRING, allowNull: false},
        beschrijving: {type: Sequelize.STRING, allowNull:false}
    });
  },

  down: async (queryInterface ) => {
    await queryInterface.dropTable('products');
  }
}
