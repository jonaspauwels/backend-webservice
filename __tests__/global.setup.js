const config = require('config'); 
const { initializeLogger } = require('../src/core/logging');
const Role = require('../src/core/roles');
const { initializeData, getSequelize } = require('../src/data');


module.exports = async () => {
  // Create a database connection
  initializeLogger(config.get('log.level'), config.get('log.disabled'));
  await initializeData();

  // Insert a test user with password 12345678
  const sequelize = getSequelize();

  await sequelize.models.User.bulkCreate(
    [
    {
      id: 1,
      naam: 'Test User',
      email: 'test.user@hogent.be',
      password_hash:
        '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
      roles: JSON.stringify([Role.USER]),
    },
    {
      id: 2,
      naam: 'Admin User',
      email: 'admin.user@hogent.be',
      password_hash:
        '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
      roles: JSON.stringify([Role.ADMIN, Role.USER]),
    }]
  );

};