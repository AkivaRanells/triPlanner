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
    }
    //remove trip from array
    removeTrip(index) {
        this.trips.splice(index, 1);
    }
    
    addPoi(newPoi, tripIndex) {
        this.trips[tripIndex].poi.push(newPoi);
    };

    deleteComment(tripIndex, poiIndex) {
        this.trips[tripIndex].poi.splice(poiIndex, 1);
      };
      //add find poiId and find tripId change from index to id 
}

export default TripsRepository