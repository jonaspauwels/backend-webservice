const Role = require('../../core/roles')

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('users', [{
      naam: 'Thomas Aelbrecht',
      email: 'thomas.aelbrecht@hogent.be',
      password_hash:
        '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
      roles: JSON.stringify([Role.ADMIN, Role.USER]),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      naam: 'Pieter Van Der Helst',
      email: 'pieter.vanderhelst@hogent.be',
      password_hash:
        '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
      roles: JSON.stringify([Role.USER]),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      naam: 'Karine Samyn',
      email: 'karine.samyn@hogent.be',
      password_hash:
        '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
      roles: JSON.stringify([Role.USER]),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
