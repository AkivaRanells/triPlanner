const Trip = require('./models/trip-model');
const POI = require('./models/poi-model');

// Initialize DB with dummy data
function initDB() {
    const poi1 = new POI({
        "name": "Notre Dame Cathedral",
        "category": "Religious Place",
        "categoryIcon": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/39.icon",
        "externalId": "s-Yz1yZWxpZ2lvdXMtcGxhY2U7aWQ9MjUwdTA5dHYtMDRmNTZiZDgyOTZkNDlhMjllOTk2YmM3ZmYwNzc2MmQ7bGF0PTQ4Ljg1MzEzO2xvbj0yLjM0ODg2O249Tm90cmUrRGFtZStDYXRoZWRyYWw7bmxhdD00OC44NTMxMztubG9uPTIuMzQ4ODY7aD02YTc4MTM",
        "position": [
            48.85313,
            2.34886
        ],
        "address": "6 Parvis Notre-Dame<br/>75004 Paris<br/>France",
        "city": "Paris",
        "district": "4e Arrondissement",
        "country": "France",
        "mapLink": "https://share.here.com/p/s-Yz1yZWxpZ2lvdXMtcGxhY2U7aWQ9MjUwdTA5dHYtMDRmNTZiZDgyOTZkNDlhMjllOTk2YmM3ZmYwNzc2MmQ7bGF0PTQ4Ljg1MzEzO2xvbj0yLjM0ODg2O249Tm90cmUrRGFtZStDYXRoZWRyYWw7bmxhdD00OC44NTMxMztubG9uPTIuMzQ4ODY7cGg9JTJCMzMxNDIzNDU2MTA7aD0zZDI2NjM"
    });
    poi1.save();

    const poi2 = new POI({
        "name": "Centre Pompidou",
        "category": "Sights & Museums",
        "categoryIcon": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/10.icon",
        "externalId": "s-Yz1zaWdodHMtbXVzZXVtcztpZD0yNTB1MDl0di02OTYyOGJhZGVkNmU0M2MzOGQ5OTBkYWU4YWNiMGJiYTtsYXQ9NDguODYwNjU7bG9uPTIuMzUxOTg7bj1DZW50cmUrUG9tcGlkb3U7bmxhdD00OC44NjA2NTtubG9uPTIuMzUxOTg7aD1kN2IxNA",
        "position": [
            48.86065,
            2.35198
        ],
        "address": "19 Rue Beaubourg<br/>75004 Paris<br/>France",
        "city": "Paris",
        "district": "4e Arrondissement",
        "country": "France",
        "mapLink": "https://share.here.com/p/s-Yz1zaWdodHMtbXVzZXVtcztpZD0yNTB1MDl0di02OTYyOGJhZGVkNmU0M2MzOGQ5OTBkYWU4YWNiMGJiYTtsYXQ9NDguODYwNjU7bG9uPTIuMzUxOTg7bj1DZW50cmUrUG9tcGlkb3U7bmxhdD00OC44NjA2NTtubG9uPTIuMzUxOTg7cGg9JTJCMzMxNDQ3ODEyMzM7aD01NDI0NjQ"
    });
    poi2.save();

    const poi3 = new POI({
        "name": "National Gallery",
        "category": "Sights & Museums",
        "categoryIcon": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/10.icon",
        "externalId": "s-Yz1zaWdodHMtbXVzZXVtcztpZD04MjZnY3B2ai00Njc0NGI5ZmY0Yjk0Yjc2YWJlNDAyYzhhZGY2OWQzMTtsYXQ9NTEuNTA4NTM7bG9uPS0wLjEyNzk0O249TmF0aW9uYWwrR2FsbGVyeTtubGF0PTUxLjUwODUzO25sb249LTAuMTI3OTQ7aD0yNDU1Mw",
        "position": [
            51.50853,
            -0.12794
        ],
        "address": "Trafalgar Square<br/>WC2<br/>London<br/>WC2N 5<br/>United Kingdom",
        "city": "London",
        "district": "WC2",
        "country": "United Kingdom",
        "mapLink": "https://share.here.com/p/s-Yz1zaWdodHMtbXVzZXVtcztpZD04MjZnY3B2ai00Njc0NGI5ZmY0Yjk0Yjc2YWJlNDAyYzhhZGY2OWQzMTtsYXQ9NTEuNTA4NTM7bG9uPS0wLjEyNzk0O249TmF0aW9uYWwrR2FsbGVyeTtubGF0PTUxLjUwODUzO25sb249LTAuMTI3OTQ7cGg9JTJCNDQyMDc4MzkzMzIxO2g9NjE0Njdj"
    });
    poi3.save();

    const trip1 = new Trip({
        name: 'Europe this summer',
        description: 'Going to Europe with the kids',
        fromDate: Date(),
        toDate: Date(),
        pois: []
    });
    trip1.pois.push(poi1);
    trip1.save();

    const trip2 = new Trip({
        name: 'Tokyo business',
        description: 'A business trip to Tokyo',
        fromDate: Date(),
        toDate: Date(),
        pois: []
    });
    trip2.pois.push(poi1, poi2, poi3);
    trip2.save();
}

module.exports.initDB = initDB;