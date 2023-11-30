const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getSequelize } = require('../src/data');

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
    let server;
    let request;
    let sequelize;

    beforeAll(async () => {
        server = await createServer(); 
        request = supertest(server.getApp().callback());
        sequelize = getSequelize();

      });

    afterAll(async () => {
        await server.stop();
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
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.rows.length).toBe(3);

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
            }

            )
        })
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

        it('should return 200 and all oogstplaatsen', async () => {
            const response = await request.get(url+'/2')
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 2,
            naam: 'Peer',
            variëteit: 'Conference',
            prijsper100kg: 100,
            OogstplaatId: 2
            });
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
        })

        it('should return 200 and all koelcellen by fruitsoortId', async () => {
            const response = await request.get(url+'/2/koelcellen');
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(2);
            expect(response.body.Koelcels[0].id).toBe(2);
            expect(response.body.Koelcels[0].capaciteit).toBe(500)

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

        it('should return 201 and created oogstplaats', async () => {
            const response = await request.post(url).send({
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
    });

    describe('POST /api/fruitsoorten/:fruitsoortId/koelcellen/:koelcelId', () => {
        const hoeveelhedenToDelete = [];
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
            await sequelize.models.Fruitsoort.bulkCreate(data.fruitsoorten);
            await sequelize.models.Koelcel.bulkCreate(data.koelcellen);
        });

        afterAll(async () => {
            for (id of hoeveelhedenToDelete) {
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
            const response = await request.post(url+'/1/koelcellen/3').send({
                hoeveelheid: 320
            });
   
            expect(response.status).toBe(201);
            expect(response.body.FruitsoortId).toBe(1);
            expect(response.body.KoelcelId).toBe(3);
            expect(response.body.hoeveelheid).toBe(320);

        hoeveelhedenToDelete.push(response.body.KoelcelId);
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
            const response = await request.put(url+'/1/koelcellen/1').send({
                hoeveelheid: 80
            });
            expect(response.status).toBe(200);
            expect(response.body.hoeveelheid).toBe(80);
        })
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
            const response = await request.put(url+'/2').send({
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
            
        })
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
            const response = await request.delete(url+'/1');
            expect(response.status).toBe(204);
            expect(response.body[0]).toBe(undefined);
        })
    });

});
