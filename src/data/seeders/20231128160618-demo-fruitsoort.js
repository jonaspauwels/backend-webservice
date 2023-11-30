module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('fruitsoorts',[{
      naam: 'Peer',
      variëteit: 'Conference',
      prijsper100kg: 100,
      oogstplaatId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      naam: 'Appel',
      variëteit: 'Elstar',
      prijsper100kg: 130,
      oogstplaatId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  {
    naam: 'Peer',
      variëteit: 'Conference',
      prijsper100kg: 100,
      oogstplaatId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
  }]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('fruitsoorts', null, {});
  }
};

