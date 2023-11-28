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
    ]
}

const dataToDelete = {
    transactions: [1,2],
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
            for (id of dataToDelete.transactions) {
                await getSequelize().models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };   
        });

        it('should return 200 and all oogstplaatsen', async () => {
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.rows.length).toBe(2);

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

    describe('GET /api/transactions/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
        });

        afterAll(async () => {
            for (id of dataToDelete.transactions) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };   
        })

        it('should return 200 and all oogstplaatsen', async () => {
            const response = await request.get(url+'/1')
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual({
                id: 1,
                naam: 'Leenaerts',
                breedtegraad: 51.267,
                lengtegraad: 4.163,
                oppervlakteInHectaren: 3.72
            });
        });
    })

    describe('POST /api/transactions', () => {
        const transactionsToDelete = [];
        
        afterAll(async () => {
            for (id of transactionsToDelete) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };  
        })

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

            transactionsToDelete.push(response.body.id);
        })    
    })

    describe('PUT /api/transactions/:id', () => {
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.bulkCreate(data.oogstplaatsen);
        });

        afterAll(async () => {
            for (id of dataToDelete.transactions) {
                await sequelize.models.Oogstplaats.destroy({
                    where:{
                        id: id
                    }
                });
            };   
        });

        it('should return 200 and updated oogstplaats', async () => {
            const response = await request.put(url+'/1').send({
                naam: 'Beernaarts',
                breedtegraad: 21.267,
                lengtegraad: 3.163,
                oppervlakteInHectaren: 5})
            
            expect(response.status).toBe(200);
            expect(response.body[0].naam).toBe('Beernaarts');
            expect(response.body[0].breedtegraad).toBe(21.267);
            expect(response.body[0].lengtegraad).toBe(3.163);
            expect(response.body[0].oppervlakteInHectaren).toBe(5);
        });
    })

    describe('DELETE /api/transactions/:id', () => {
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
            console.log(response.body[0])
            expect(response.status).toBe(204);
            expect(response.body[0]).toBe(undefined);
        })
    })
});

