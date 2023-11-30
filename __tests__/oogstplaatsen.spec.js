const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getSequelize } = require('../src/data');

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
            const response = await request.get(url);
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
            const response = await request.get(url+'/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                naam: 'Leenaerts',
                breedtegraad: 51.267,
                lengtegraad: 4.163,
                oppervlakteInHectaren: 3.72
            });
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
            const response = await request.get(url+'/2/fruitsoorten');
            expect(response.status).toBe(200);
            expect(response.body.Fruitsoorts[0].id).toBe(2);
            expect(response.body.Fruitsoorts[0].naam).toBe('Peer')
            expect(response.body.Fruitsoorts[0].prijsper100kg).toBe(100)
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
            const response = await request.post(url).send({
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
        })    
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
            const response = await request.put(url+'/1').send({
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
            const response = await request.delete(url+'/1');
            expect(response.status).toBe(204);
            expect(response.body[0]).toBe(undefined);
        })
    })
});

