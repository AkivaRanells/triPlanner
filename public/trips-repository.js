/** 
 * @class reponsible for adding and removing trips and points of interest to 
 * in-app array
*/
class TripsRepository {
    constructor() {
        this.trips = [];
    }
    //addTrip to array
    addTrip(tripFromDB) {
        this.trips.push(tripFromDB);
        return tripFromDB._id;
    }
    //remove trip from array
    removeTrip(tripId) {
        const trip = this.getTripById(tripId);
        this.trips.splice(this.trips.indexOf(trip), 1);
    }

    addPoi(newPoi, tripId) {
        const trip = this.getTripById(tripId);
        trip.pois.push(newPoi);
    };

    removePoi(tripId, poiId) {
        const trip = this.getTripById(tripId);
        const poi = this.getPoiById(tripId, poiId);
        trip.pois.splice(trip.pois.indexOf(poi), 1);
    };
    //add find poiId and find tripId change from index to id 

    getTripById(tripId) {
        for (let trip of this.trips) {
            if (trip._id === tripId) {
                return trip;
            }
        };
        return null;
    }

    getPoiById(tripId, poiId) {
        for (let poi of this.getTripById(tripId).pois) {
            if (poi._id === poiId) {
                return poi;
            }
        };
        return null;
    }
}

export default TripsRepository