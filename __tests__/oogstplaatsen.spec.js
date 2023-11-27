const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getSequelize } = require('../src/data');

const data = {
    oogstplaatsen: [{
        id: 1,
        naam: 'Leenaerts',
        geolocatie: {
            breedtegraad: 51.267028,
            lengtegraad: 4.163944,
        },
        oppervlakteInHectaren: 3.72
    },
    {id: 2,
    naam: 'Proeftuin',
    geolocatie: {
        breedtegraad: 51.2511,
        lengtegraad: 4.1383,
    },
    oppervlakteInHectaren: 10.42
    },
    ]
}

const dataToDelete = {
    transactions: [1],
}

describe('Oogstplaatsen', () => {
    let server;
    let request;
    let sequelize;
    let test;

    beforeAll(async () => {
        server = await createServer(); 
        request = supertest(server.getApp().callback());
        sequelize = getSequelize();
        test = 5
      });

    afterAll(async () => {
        await server.stop();
    });

    const url = '/api/oogstplaatsen';

    describe('GET /api/oogstplaatsen', () => {
        
        beforeAll(async () => {
            await sequelize.models.Oogstplaats.create({
                id: 1,
                naam: 'test', 
                breedtegraad: 42.1,
                lengtegraad: 4.7,
                oppervlakteInHectaren: 3.2,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        afterAll(async () => {
            for (id in dataToDelete.transactions) {
                await getSequelize().models.Oogstplaats.destroy({
                    where:{
                        id: 1
                    }
                });
            };   
        })

        it('should 200 and return all oogstplaatsen', async () => {
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.items.length).toBe(1);

            expect(response.body.items[0]).toEqual({id: 1,
                naam: 'test', 
                breedtegraad: 42.1,
                lengtegraad: 4.7,
                oppervlakteInHectaren: 3.2
            }
            );
        });
    });



});

