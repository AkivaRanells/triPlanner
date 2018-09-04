const Trip = require('./models/trip-model');
const POI = require('./models/poi-model');

// Initialize DB with dummy data
function initDB() {
    const poi1 = new POI({
        "title": "Lotus Blue",
        "category": "Restaurant",
        "iconUrl": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon",
        "externalId": "840dr5re-346331bf542449c99a6970a84f7d8d3f",
        "position": [
            40.71604,
            -74.00846
        ],
        "vicinity": "110 Reade St<br/>New York, NY 10013"
    });
    poi1.save();

    const poi2 = new POI({
        "title": "McDonald's",
        "category": "Snacks/Fast food",
        "iconUrl": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon",
        "externalId": "840dr5re-be38eea0a2464456965beb120881488f",
        "position": [
            40.71581,
            -74.00532
        ],
        "vicinity": "317 Broadway<br/>New York, NY 10007"
    });
    poi2.save();

    const poi3 = new POI({
        "title": "Barleycorn",
        "category": "Restaurant",
        "iconUrl": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon",
        "externalId": "840aabd1-d9f2c62755250ca2bef227a547d4f341",
        "position": [
            40.71308,
            -74.00883
        ],
        "vicinity": "23 Park Pl<br/>New York, NY 10007"
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