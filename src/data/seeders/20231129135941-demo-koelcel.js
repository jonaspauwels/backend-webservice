module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('koelcels',[{
      capaciteit: 420,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      capaciteit: 500,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      capaciteit: 600,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('koelcels', null, {});
  }
};
