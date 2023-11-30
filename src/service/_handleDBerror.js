const ServiceError = require('../core/serviceError');

const handleDBError = (error) => {
    const { code = '', sqlMessage } = error;

    if (code === 'ER_DUP_ENTRY') {
        switch (true) {
          case sqlMessage.includes('idx_oogstplaats_naam_unique'):
            return ServiceError.validationFailed(
              'Oogstplaats with this name already exists'
            );
          default:
            return ServiceError.validationFailed('This item already exists');
        }
      }

      if (code.startsWith('ER_NO_REFERENCED_ROW')) {
        switch (true) {
          case sqlMessage.includes('OogstplaatId'):
            return ServiceError.notFound('This oogstplaats does not exist');
          case sqlMessage.includes('FruitsoortId'):
            return ServiceError.notFound('This fruitsoort does not exist');
          case sqlMessage.includes('KoelcelId'):
            return ServiceError.notFound('This koelcel does not exist');
        }
      }

      return error;
};

module.exports = handleDBError;