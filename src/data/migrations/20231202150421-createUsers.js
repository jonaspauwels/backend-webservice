module.exports = {
    up: async ( queryInterface, Sequelize) => {
    
     await queryInterface.createTable('users', {
        id: {type: Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
        naam: {type: Sequelize.STRING, allowNull:false},
        email: {type: Sequelize.STRING, allowNull:false, unique:'idx_user_email_unique'},
        password_hash: {type: Sequelize.STRING, allowNull:false},
        roles: {type: Sequelize.JSON, allowNull: false},
     });
   },
 
 down: async (queryInterface) => {
     await queryInterface.dropTable('users');
   }
 }