module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('products',[{
      naam: 'Geoxe',
      beschrijving: 'fungicide in de bestrijding van vruchtrot bij appel en peer',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
