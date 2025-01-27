const { withServer, login } = require('./supertest.setup');
const { testAuthHeader } = require('./common/auth');

const data = {
    oogstplaatsen: [
        {
            id: 1,
            naam: 'Leenaerts',
            breedtegraad: 51.267,
            lengtegraad: 4.163,
            oppervlakteInHectaren: 3.72
        },
        {
            id: 2,
            naam: 'Proeftuin',
            breedtegraad: 51.251,
            lengtegraad: 4.138,
            oppervlakteInHectaren: 10.42
        }
        ],
    fruitsoorten: [
        {
            id: 1,
            naam: 'Peer',
            variëteit: 'Conference',
            prijsper100kg: 100,
            OogstplaatId: 1
        },
        {
            id: 2,
            naam: 'Peer',
            variëteit: 'Conference',
            prijsper100kg: 100,
            OogstplaatId: 2
        },
        {
            id: 3,
            naam: 'Appel',
            variëteit: 'Elstar',
            prijsper100kg: 130,
            OogstplaatId: 2
        }
    ],
    koelcellen: [
        {
            id: 1,
            capaciteit: 400
        },
        {
            id: 2,
            capaciteit: 500
        },
        {
            id: 3,
            capaciteit: 600
        }
    ],
    hoeveelheden: [{
        hoeveelheid: 70,
        FruitsoortId: 1,
        KoelcelId: 1
      },
      {
        hoeveelheid: 100,
        FruitsoortId: 1,
        KoelcelId: 2

      },
      {
        hoeveelheid: 200,
        FruitsoortId: 2,
        KoelcelId: 2
      },
      {
        hoeveelheid: 25,
        FruitsoortId: 2,
        KoelcelId: 3
      }
    ]
}

const dataToDelete = {
    fruitsoorten: [1,2,3],
    oogstplaatsen: [1,2],
    koelcellen: [1,2,3],
}

describe('Fruitsoorten', () => {
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

    const url = '/api/fruitsoorten';

    describe('GET /api/fruitsoorten', () => {
        beforeAll(async () => { 
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten)
        });

        afterAll(async () => {
            for (id of dataToDelete.fruitsoorten) {
                await sequelize.models.Fruitsoort.destroy({
                    where:{
                        id: id
                    }
                });
            };
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };  
        });

        it('should return 200 and all fruitsoorten', async () => {
            const response = await request.get(url).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(3);

            expect(response.body.rows[0]).toEqual({
                id: 1,
                naam: 'Peer',
                variëteit: 'Conference',
                prijsper100kg: 100,
                OogstplaatId: 1
            });
            expect(response.body.rows[2]).toEqual({
                id: 3,
                naam: 'Appel',
                variëteit: 'Elstar',
                prijsper100kg: 130,
                OogstplaatId: 2
            });
        });

        it('should return 400 when given an argument', async () => {
            const response = await request.get(url+'?invalid=true').set('Authorization', authHeader);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('invalid');
          });
    });
    
    describe('GET /api/fruitsoorten/:id', () => {
        beforeAll(async () => { 
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten)
        });

        afterAll(async () => {
            for (id of dataToDelete.fruitsoorten) {
                await sequelize.models.Fruitsoort.destroy({
                    where:{
                        id: id
                    }
                });
            };
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };  
        });

        it('should return 200 and requested fruitsoort by id', async () => {
            const response = await request.get(url+'/2').set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 2,
            naam: 'Peer',
            variëteit: 'Conference',
            prijsper100kg: 100,
            OogstplaatId: 2
            });
        });

        it('should 404 when requesting not existing fruitsoort', async () => {
            const response = await request.get(url+'/4').set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No fruitsoort with id 4 exists',
              details: {
                id: 4,
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
    });
    
    describe('GET /api/fruitsoorten/:fruitsoortId/koelcellen', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten);
            await sequelize.models.Koelcel.bulkCreate(data.koelcellen);
            await sequelize.models.HoeveelheidPerKoelcel.bulkCreate(data.hoeveelheden);
        });
        afterAll(async () => {
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.HoeveelheidPerKoelcel.destroy({
                    where:{KoelcelId:id}
                })
            };
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.Koelcel.destroy({
                    where:{id:id}
                })
            }
            for (id of dataToDelete.fruitsoorten) {
                await sequelize.models.Fruitsoort.destroy({
                    where:{id:id}
                })
            }
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{id:id}
                })
            }
        });

        it('should return 200 and all koelcellen by fruitsoortId', async () => {
            const response = await request.get(url+'/2/koelcellen').set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(2);
            expect(response.body.Koelcels[0].id).toBe(2);
            expect(response.body.Koelcels[0].capaciteit).toBe(500);
        });

        it('should 404 when requesting not existing fruitsoort', async () => {
            const response = await request.get(url+'/4/koelcellen').set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No fruitsoort with id 4 exists',
              details: {
                id: 4,
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

    });

    describe('POST /api/fruitsoorten', () => {
        const fruitsoortenToDelete = [];
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
        });

        afterAll(async () => {
            for (id of fruitsoortenToDelete) {
                await sequelize.models.Fruitsoort.destroy({
                    where: {id:id}
                })
            }
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{id: id}
                });
            };
        });

        it('should return 201 and created fruitsoort', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Conference',
                prijsper100kg: 100,
                OogstplaatId: 1,
            });
            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.naam).toBe('Peer');
            expect(response.body.variëteit).toBe('Conference');
            expect(response.body.prijsper100kg).toBe(100);
            expect(response.body.OogstplaatId).toBe(1)

            fruitsoortenToDelete.push(response.body.id)
        });

        it('should return 404 when oogstplaats does not exists', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Conference',
                prijsper100kg: 100,
                OogstplaatId: 3,
            });


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
            const response = await request.post(url).set('Authorization', authHeader).send({
                variëteit: 'Conference',
                prijsper100kg: 100,
                OogstplaatId: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('naam'); 
        });


        it('should return 400 when missing variëteit', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Peer',
                prijsper100kg: 100,
                OogstplaatId: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('variëteit'); 
        });

        it('should return 400 when missing prijsper100kg', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Conference',
                OogstplaatId: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('prijsper100kg'); 
        });

        it('should return 400 when missing OogstplaatId', async () => {
            const response = await request.post(url).set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Conference',
                prijsper100kg: 100,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('OogstplaatId'); 
        });

        
    });

    describe('POST /api/fruitsoorten/:fruitsoortId/koelcellen/:koelcelId', () => {

        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten);
            await sequelize.models.Koelcel.bulkCreate(data.koelcellen);
            await sequelize.models.HoeveelheidPerKoelcel.bulkCreate(data.hoeveelheden);
        });

        afterAll(async () => {
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.HoeveelheidPerKoelcel.destroy({
                    where:{KoelcelId:id}
                })
            }
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.Koelcel.destroy({
                    where:{id:id}
                })
            }
            for (id of dataToDelete.fruitsoorten) {
                await sequelize.models.Fruitsoort.destroy({
                    where:{id:id}
                })
            }
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{id:id}
                })
            }
        });

        it('should return 201 and created hoeveelheid', async () => {
            const response = await request.post(url+'/1/koelcellen/3').set('Authorization', authHeader).send({
                hoeveelheid: 320
            });
            expect(response.status).toBe(201);
            expect(response.body.FruitsoortId).toBe(1);
            expect(response.body.KoelcelId).toBe(3);
            expect(response.body.hoeveelheid).toBe(320);


        });

        it('should return 400 when missing hoeveelheid', async () => {
            const response = await request.post(url+'/1/koelcellen/3').set('Authorization', authHeader).send({
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('hoeveelheid'); 
        });

        it('should return 404 when posting non existing fruitsoort', async () => {
            const response = await request.post(url+'/4/koelcellen/3').set('Authorization', authHeader).send({
                hoeveelheid: 320});
            
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'No fruitsoort with id 4 exists',
                details: {
                  id: 4,
                },
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 404 when posting non existing koelcel', async () => {
            const response = await request.post(url+'/1/koelcellen/4').set('Authorization', authHeader).send({
                hoeveelheid: 320});
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'No koelcel with id 4 exists',
                details: {
                  id: 4,
                },
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 400 when combo koelcel fruitsoort already exists', async () => {
            const response = await request.post(url+'/1/koelcellen/1').set('Authorization', authHeader).send({
                hoeveelheid: 320});
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                code: 'DUPLICATE_VALUES',
                message: 'Match between koelcel 1 and fruitsoort 1 already exists, please use update (PUT).',
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 400 when added hoeveelheid exceeds koelcel capacity', async () => {
            const response = await request.post(url+'/3/koelcellen/1').set('Authorization', authHeader).send({
                hoeveelheid: 400});
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                code: 'EXCEEDED_CAPACITY',
                message: 'Hoeveelheid is groter dan capaciteit van koelcel 1',
              });
              expect(response.body.stack).toBeTruthy();
        });

    });

    describe('PUT /api/fruitsoorten/:fruitsoortId/koelcellen/:koelcelId', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten);
            await sequelize.models.Koelcel.bulkCreate(data.koelcellen);
            await sequelize.models.HoeveelheidPerKoelcel.bulkCreate(data.hoeveelheden);
        });
        afterAll(async () => {
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.HoeveelheidPerKoelcel.destroy({
                    where:{KoelcelId:id}
                })
            };
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.Koelcel.destroy({
                    where:{id:id}
                })
            }
            for (id of dataToDelete.fruitsoorten) {
                await sequelize.models.Fruitsoort.destroy({
                    where:{id:id}
                })
            }
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{id:id}
                })
            }
        })

        it('should return 200 and updated hoeveelheid', async () => {
            const response = await request.put(url+'/1/koelcellen/1').set('Authorization', authHeader).send({
                hoeveelheid: 80
            });
            expect(response.status).toBe(200);
            expect(response.body.hoeveelheid).toBe(80);
        })

        it('should return 400 when missing hoeveelheid', async () => {
            const response = await request.put(url+'/1/koelcellen/3').set('Authorization', authHeader).send({
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('hoeveelheid'); 
        });

        it('should return 404 when posting non existing fruitsoort', async () => {
            const response = await request.put(url+'/4/koelcellen/3').set('Authorization', authHeader).send({
                hoeveelheid: 320});
            
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'No fruitsoort with id 4 exists',
                details: {
                  id: 4,
                },
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 404 when posting non existing koelcel', async () => {
            const response = await request.put(url+'/1/koelcellen/4').set('Authorization', authHeader).send({
                hoeveelheid: 320});
            
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'No koelcel with id 4 exists',
                details: {
                  id: 4,
                },
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 400 when combo koelcel fruitsoort not yet exists', async () => {
            const response = await request.put(url+'/1/koelcellen/3').set('Authorization', authHeader).send({
                hoeveelheid: 320});
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                code: 'VALIDATION_FAILED',
                message: 'Match between koelcel 3 and fruitsoort 1 does not exists, please use create (POST).',
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 400 when added hoeveelheid exceeds koelcel capacity', async () => {
            const response = await request.put(url+'/1/koelcellen/1').set('Authorization', authHeader).send({
                hoeveelheid: 500});
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                code: 'EXCEEDED_CAPACITY',
                message: 'Hoeveelheid is groter dan capaciteit van koelcel 1',
              });
              expect(response.body.stack).toBeTruthy();
        });

    });

    describe('PUT /api/fruitsoorten/:id', () => {
        beforeAll( async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten);
        });
        afterAll( async () => {
            for (id of dataToDelete.fruitsoorten) {
                await sequelize.models.Fruitsoort.destroy({
                    where:{id:id}
                })
            };
            for (id of dataToDelete.oogstplaatsen) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{id:id}
                })
            };
        });

        it('shoud return 200 and updated fruitsoort', async () => {
            const response = await request.put(url+'/2').set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Durondeau',
                prijsper100kg: 120,
                OogstplaatId: 2
            });
            expect(response.status).toBe(200);
            expect(response.body.naam).toBe('Peer');
            expect(response.body.variëteit).toBe('Durondeau');
            expect(response.body.prijsper100kg).toBe(120);
            expect(response.body.OogstplaatId).toBe(2);
            
        });

        it('should return 404 when updating non existing fruitsoort', async () => {
            const response = await request.put(url+'/4').set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Durondeau',
                prijsper100kg: 120,
                OogstplaatId: 2});
            
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'No fruitsoort with id 4 exists',
                details: {
                  id: 4,
                },
              });
              expect(response.body.stack).toBeTruthy();
        });

        it('should return 404 when oogstplaats does not exists', async () => {
            const response = await request.put(url+'/1').set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Conference',
                prijsper100kg: 100,
                OogstplaatId: 3,
            });


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
            const response = await request.put(url+'/1').set('Authorization', authHeader).send({
                variëteit: 'Conference',
                prijsper100kg: 100,
                OogstplaatId: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('naam'); 
        });


        it('should return 400 when missing variëteit', async () => {
            const response = await request.put(url+'/1').set('Authorization', authHeader).send({
                naam: 'Peer',
                prijsper100kg: 100,
                OogstplaatId: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('variëteit'); 
        });

        it('should return 400 when missing prijsper100kg', async () => {
            const response = await request.put(url+'/1').set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Conference',
                OogstplaatId: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('prijsper100kg'); 
        });

        it('should return 400 when missing OogstplaatId', async () => {
            const response = await request.put(url+'/1').set('Authorization', authHeader).send({
                naam: 'Peer',
                variëteit: 'Conference',
                prijsper100kg: 100,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('OogstplaatId'); 
        });
    });

    describe('DELETE /api/fruitsoorten/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.create({
                id: 1,
                naam: 'Leenaerts',
                breedtegraad: 51.267,
                lengtegraad: 4.163,
                oppervlakteInHectaren: 3.72
            })
            await sequelize.models.Fruitsoort.create({
                id: 1,
                naam: 'Peer',
                variëteit: 'Conference',
                prijsper100kg: 100,
                OogstplaatId: 1 
            });
        });

        afterAll(async () => {
            await sequelize.models.Oogstplaats.destroy({
                where: {id:1}
            });
        });

        it('should return 204 and empty body', async () => {
            const response = await request.delete(url+'/1').set('Authorization', authHeader);
            expect(response.status).toBe(204);
            expect(response.body[0]).toBe(undefined);
        });

        it('should return 400 with invalid fruitsoort id', async () => {
            const response = await request.delete(url+'/invalid').set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.params).toHaveProperty('id');
          });

          it('should return 404 with not existing fruitsoort', async () => {
            const response = await request.delete(url+'/4').set('Authorization', authHeader);
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No fruitsoort with id 4 exists',
              details: {
                id: 4,
              },
            });
            expect(response.body.stack).toBeTruthy();
          });
    });
    testAuthHeader(() => request.get(url));
});
