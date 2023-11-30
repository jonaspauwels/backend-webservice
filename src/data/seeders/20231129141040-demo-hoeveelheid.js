
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('hoeveelheidperkoelcels', [{
      hoeveelheid: 70,
      FruitsoortId: 7,
      KoelcelId: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      hoeveelheid: 100,
      FruitsoortId: 7,
      KoelcelId: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      hoeveelheid: 200,
      FruitsoortId: 9,
      KoelcelId: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      hoeveelheid: 25,
      FruitsoortId: 9,
      KoelcelId: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('hoeveelheidperkoelcels', null, {});
  }
};
