let FRUITSOORTEN = [
    {
        id: 1,
        naam: 'Peer',
        variëteit: 'Conference',
        prijsper100kg: 100,
        oogstplaats: 1,
    },
    {
        id: 2,
        naam: 'Peer',
        variëteit: 'Conference',
        prijsper100kg: 100,
        oogstplaats: 2,
    },
    {
        id: 3,
        naam: 'Appel',
        variëteit: 'Elstar',
        prijsper100kg: 130,
        oogstplaats: 3,
    }
];

let OOGSTPLAATSEN = [
    {
        id: 1,
        naam: 'Leenaerts',
        geolocatie: {
            latitude: 51.267028,
            longitude: 4.163944,
        },
        oppervlakteInHectaren: 3.6
    }
    
    
]

module.exports = { FRUITSOORTEN, OOGSTPLAATSEN };