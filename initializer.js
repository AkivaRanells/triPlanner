const Trip = require('./models/trip-model');
const POI = require('./models/poi-model');

// Initialize DB with dummy data
function initDB() {
    const poi1 = new POI({
        "title": "Taverne Henri IV",
        "category": "Coffee/Tea",
        "iconUrl": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/23.icon",
        "externalId": "s-Yz1jb2ZmZWUtdGVhO2lkPTI1MHUwOXR2LWIyYzY5ODUwM2QwYjRiOTRiMjhiNjZjMzc3YzdhY2I4O2xhdD00OC44NTc7bG9uPTIuMzQxNDg7bj1UYXZlcm5lK0hlbnJpK0lWO25sYXQ9NDguODU3MDk7bmxvbj0yLjM0MTM3O2g9MTQzYjM3",
        "position": [
            48.857,
            2.341481
        ],
        "vicinity": "13 Place du Pont-Neuf<br/>75001 Paris"
    });
    poi1.save();

    const poi2 = new POI({
        "title": "Les Voyelles",
        "category": "Coffee/Tea",
        "iconUrl": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/23.icon",
        "externalId": "s-Yz1jb2ZmZWUtdGVhO2lkPTI1MGp4N3BzLTgyOWNjZmM5N2RjZjA3OWU4Mzk4NThmNjI5YWU3YjIwO2xhdD00OC44NTY3OTtsb249Mi4zNDE0OTtuPUxlcytWb3llbGxlcztubGF0PTQ4Ljg1Njc1O25sb249Mi4zNDEzMTtoPTM4MTIzNg",
        "position": [
            48.85679,
            2.34149
        ],
        "vicinity": "74 Quai des Orfèvres<br/>75001 Paris"
    });
    poi2.save();

    const poi3 = new POI({
        "title": "Sequana",
        "category": "Restaurant",
        "iconUrl": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon",
        "externalId": "s-Yz1yZXN0YXVyYW50O2lkPTI1MGFhYmQxLTY1ZjM3MWJiMzYxZTBiNDA4N2U5NmVjYzIyYjc0ZWU0O2xhdD00OC44NTY3NTtsb249Mi4zNDE1NDtuPVNlcXVhbmE7bmxhdD00OC44NTY2OTtubG9uPTIuMzQxNDI7aD0zYzVlMmI",
        "position": [
        48.85675,
        2.34154
        ],
        "vicinity": "72 Quai des Orfèvres<br/>Paris"
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