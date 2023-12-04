const { shutdownData, getSequelize } = require('../src/data'); // 👈 2 en 3

module.exports = async () => {
  // Remove any leftover data
  await getSequelize().models.User.destroy({where: {}});
  await getSequelize().models.Koelcel.destroy({where: {}});
  await getSequelize().models.Fruitsoort.destroy({where: {}});
  await getSequelize().models.Oogstplaats.destroy({where: {}});
  await getSequelize().models.HoeveelheidPerKoelcel.destroy({where: {}});

  // Close database connection
  await shutdownData();
};
