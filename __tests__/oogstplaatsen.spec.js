const { withServer, login } = require('./supertest.setup');
const { testAuthHeader } = require('./common/auth');

const data = {
    oogstplaatsen: [{
        id: 1,
        naam: 'Leenaerts',
        breedtegraad: 51.267,
        lengtegraad: 4.163,
        oppervlakteInHectaren: 3.72
    },
    {id: 2,
    naam: 'Proeftuin',
    breedtegraad: 51.251,
    lengtegraad: 4.138,
    oppervlakteInHectaren: 10.42
    },
    ],
    fruitsoorten: [
        {
            id: 1,
            naam: 'Peer',
            variëteit: 'Conference',
            prijsper100kg: 100,
            OogstplaatId: 1,
        },
        {
            id: 2,
            naam: 'Peer',
            variëteit: 'Conference',
            prijsper100kg: 100,
            OogstplaatId: 2,
        },
        {
            id: 3,
            naam: 'Appel',
            variëteit: 'Elstar',
            prijsper100kg: 130,
            OogstplaatId: 2,
        }
    ]

}

const dataToDelete = {
    oogstplaatsen: [1,2],
    fruitsoorten: [1,2,3],
}

describe('Oogstplaatsen', () => {
    let request;
    let sequelize;
    let authHeader;

    withServer(({supertest, sequelize: s}) => {
        request = supertest;
        sequelize = s;
    });

    beforeAll(async () => {
        authHeader = await login(request);
      });

    const url = '/api/oogstplaatsen';

    describe('GET /api/oogstplaatsen', () => {
        
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
        });

        afterAll(async () => {
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };   
        });

        it('should return 200 and all oogstplaatsen', async () => {
            const response = await request.get(url).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2);

            expect(response.body.rows[0]).toEqual({
                id: 1,
                naam: 'Leenaerts',
                breedtegraad: 51.267,
                lengtegraad: 4.163,
                oppervlakteInHectaren: 3.72
            }
            );
            expect(response.body.rows[1]).toEqual({
                id: 2,
                naam: 'Proeftuin',
                breedtegraad: 51.251,
                lengtegraad: 4.138,
                oppervlakteInHectaren: 10.42
            }
            );
        });

        it('should return 400 when given an argument', async () => {
            const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('invalid');
          });
    });

    describe('GET /api/oogstplaatsen/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
        });

        afterAll(async () => {
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };   
        });

        it('should return 200 and requested oogstplaats by id', async () => {
            const response = await request.get(url+'/1').set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                naam: 'Leenaerts',
                breedtegraad: 51.267,
                lengtegraad: 4.163,
                oppervlakteInHectaren: 3.72
            });
        });

        it('should 404 when requesting not existing oogstplaats', async () => {
            const response = await request.get(url+'/3').set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No oogstplaats with id 3 exists',
              details: {
                id: 3,
              },
            });
            expect(response.body.stack).toBeTruthy();
          });

        it('should 400 when given an argument', async () => {
            const response = await request.get(url+'?invalid=true').set('Authorization', authHeader);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('invalid');
          });
    })

    describe('GET /api/oogstplaatsen/:oogstplaatsId/fruitsoorten', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten);
        });

         afterAll(async () => {
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };  
            for (id of dataToDelete.fruitsoorten) {
                await sequelize.models.Fruitsoort.destroy({
                    where:{
                        id: id
                    }
                });
            };  
        });

        it('should return 200 and all fruitsoorten by oogstplaatsId', async () => {
            const response = await request.get(url+'/2/fruitsoorten').set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.Fruitsoorts[0].id).toBe(2);
            expect(response.body.Fruitsoorts[0].naam).toBe('Peer')
            expect(response.body.Fruitsoorts[0].prijsper100kg).toBe(100)
        });

        it('should return 404 when requesting not existing oogstplaats', async () => {
            const response = await request.get(url+'/3').set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No oogstplaats with id 3 exists',
              details: {
                id: 3,
              },
            });
            expect(response.body.stack).toBeTruthy();
          });

        it('should return 400 when given an argument', async () => {
            const response = await request.get(url+'?invalid=true').set('Authorization', authHeader);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('invalid');
          });
    })

    describe('POST /api/oogstplaatsen', () => {
        const oogstplaatsenToDelete = [];
        
        afterAll(async () => {
            for (id of oogstplaatsenToDelete) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };  
        });

        it('should return 201 and created oogstplaats', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Test_oogstplaats',
                breedtegraad: 5.1267,
                lengtegraad: 41.63,
                oppervlakteInHectaren: 37.2
            });

            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.naam).toBe('Test_oogstplaats');
            expect(response.body.breedtegraad).toBe(5.1267);
            expect(response.body.lengtegraad).toBe(41.63);
            expect(response.body.oppervlakteInHectaren).toBe(37.2);

            oogstplaatsenToDelete.push(response.body.id);
        });
        
        it('should return 400 when missing naam', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                breedtegraad: 5.1267,
                lengtegraad: 41.63,
                oppervlakteInHectaren: 37.2
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('naam'); 
        });

        it('should return 400 when missing breedtegraad', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Test_oogstplaats',
                lengtegraad: 41.63,
                oppervlakteInHectaren: 37.2
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('breedtegraad'); 
        });

        it('should return 400 when missing lengtegraad', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Test_oogstplaats',
                breedtegraad: 5.1267,
                oppervlakteInHectaren: 37.2
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('lengtegraad'); 
        });

        it('should return 400 when missing oppervlakteInHectaren', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Test_oogstplaats',
                breedtegraad: 5.1267,
                lengtegraad: 41.63,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('oppervlakteInHectaren'); 
        });
    })

    describe('PUT /api/oogstplaatsen/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
        });

        afterAll(async () => {
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{id: id}
                });
            };   
        });

        it('should return 200 and updated oogstplaats', async () => {
            const response = await request.put(url+'/1').set('Authorization', authHeader).send({
                naam: 'Beernaarts',
                breedtegraad: 21.267,
                lengtegraad: 3.163,
                oppervlakteInHectaren: 5});
            
            expect(response.status).toBe(200);
            expect(response.body.naam).toBe('Beernaarts');
            expect(response.body.breedtegraad).toBe(21.267);
            expect(response.body.lengtegraad).toBe(3.163);
            expect(response.body.oppervlakteInHectaren).toBe(5);
        });

        it('should return 404 when updating non existing oogstplaats', async () => {
            const response = await request.put(url+'/3').set('Authorization', authHeader).send({
                naam: 'Beernaarts',
                breedtegraad: 21.267,
                lengtegraad: 3.163,
                oppervlakteInHectaren: 5});
            
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'No oogstplaats with id 3 exists',
                details: {
                  id: 3,
                },
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 400 when missing naam', async () => {
            const response = await request.put(url+'/3').set('Authorization', authHeader).send({
                breedtegraad: 5.1267,
                lengtegraad: 41.63,
                oppervlakteInHectaren: 37.2
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('naam'); 
        });

        it('should return 400 when missing breedtegraad', async () => {
            const response = await request.put(url+'/3').set('Authorization', authHeader).send({
                naam: 'Test_oogstplaats',
                lengtegraad: 41.63,
                oppervlakteInHectaren: 37.2
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('breedtegraad'); 
        });

        it('should return 400 when missing lengtegraad', async () => {
            const response = await request.put(url+'/3').set('Authorization', authHeader).send({
                naam: 'Test_oogstplaats',
                breedtegraad: 5.1267,
                oppervlakteInHectaren: 37.2
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('lengtegraad'); 
        });

        it('should return 400 when missing oppervlakteInHectaren', async () => {
            const response = await request.put(url+'/3').set('Authorization', authHeader).send({
                naam: 'Test_oogstplaats',
                breedtegraad: 5.1267,
                lengtegraad: 41.63,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('oppervlakteInHectaren'); 
        });
    })

    describe('DELETE /api/oogstplaatsen:id', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.create({
                id: 1,
                naam: 'Leenaerts',
                breedtegraad: 51.267,
                lengtegraad: 4.163,
                oppervlakteInHectaren: 3.72
            });
        });

        it('should return 204 and empty body', async () => {
            const response = await request.delete(url+'/1').set('Authorization', authHeader);
            expect(response.status).toBe(204);
            expect(response.body[0]).toBe(undefined);
        });

        it('should return 400 with invalid oogstplaats id', async () => {
            const response = await request.delete(url+'/invalid').set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.params).toHaveProperty('id');
          });

          it('should return 404 with not existing oogstplaats', async () => {
            const response = await request.delete(url+'/3').set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No oogstplaats with id 3 exists',
              details: {
                id: 3,
              },
            });
            expect(response.body.stack).toBeTruthy();
          });
    });

    testAuthHeader(() => request.get(url));
});

