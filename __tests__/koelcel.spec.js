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

describe('Oogstplaatsen', () => {
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

    const url = '/api/koelcellen';

    describe('GET /api/koelcellen', () => {
        beforeAll(async() => {
            await sequelize.models.Koelcel.bulkCreate(data.koelcellen);
        });

        afterAll(async () => {
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.Koelcel.destroy({
                    where:{
                        id: id
                    }
                });
            }; 
        });

        it('should return 200 and all koelcellen', async () => {
            const response = await request.get(url);
            console.log(response.body)
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(3);
            expect(response.body.rows[0]).toEqual({
                id:1,
                capaciteit:400
            });
            expect(response.body.rows[1]).toEqual({
                id:2,
                capaciteit:500
            });
            expect(response.body.rows[2]).toEqual({
                id:3,
                capaciteit:600
            });

        })
    });

    describe('GET /api/koelcellen/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Koelcel.bulkCreate(data.koelcellen);
        });

        afterAll(async () => {
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.Koelcel.destroy({
                    where:{
                        id: id
                    }
                });
            };   
        });

        it('should return 200 and requested koelcel by id', async () => {
            const response = await request.get(url+'/2');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 2,
                capaciteit: 500
            });
        });
    });

    describe('GET /api/koelcellen/:koelcelId/fruitsoorten', () => {
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

        it('should return 200 and all fruitsoorten by koelcelId', async () => {
            const response = await request.get(url+'/2/fruitsoorten');
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(2);
            expect(response.body.Fruitsoorts[0].id).toBe(1);
            expect(response.body.Fruitsoorts[0].naam).toBe('Peer');
            expect(response.body.Fruitsoorts[0].variëteit).toBe('Conference');
            expect(response.body.Fruitsoorts[0].prijsper100kg).toBe(100);
            expect(response.body.Fruitsoorts[0].OogstplaatId).toBe(1);

            expect(response.body.Fruitsoorts[1].id).toBe(2);
            expect(response.body.Fruitsoorts[1].naam).toBe('Peer');
            expect(response.body.Fruitsoorts[1].variëteit).toBe('Conference');
            expect(response.body.Fruitsoorts[1].prijsper100kg).toBe(100);
            expect(response.body.Fruitsoorts[1].OogstplaatId).toBe(2);
        });
    });

    describe('POST /api/koelcellen', () => {
        const koelcellenToDelete = [];

        afterAll(async () => {
            for (id of koelcellenToDelete) {
                await sequelize.models.Koelcel.destroy({
                    where:{
                        id: id
                    }
                });
            };  
        });

        it('should return 201 and created koelcel', async () => {
            const response = await request.post(url).send({
                capaciteit: 900
            });

            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.capaciteit).toBe(900);

            koelcellenToDelete.push(response.body.id);
        })
    });

    describe('PUT /api/koelcellen/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Koelcel.bulkCreate(data.koelcellen);
        });

        afterAll(async () => {
            for (id of dataToDelete.koelcellen) {
                await sequelize.models.Koelcel.destroy({
                    where:{id: id}
                });
            };   
        });

        it('should return 200 and updated koelcel', async () => {
            const response = await request.put(url+'/1').send({
                capaciteit: 200
            });

            expect(response.status).toBe(200);
            expect(response.body.capaciteit).toBe(200);
        });
    });

    describe('DELETE /api/koelcellen/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Koelcel.create({
                id: 1,
                capaciteit: 1200
            });
        });


        it('should return 204 and empty body', async () => {
            const response = await request.delete(url+'/1');
            expect(response.status).toBe(204);
            expect(response.body[0]).toBe(undefined);
        })
    });
});