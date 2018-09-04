/**
 * @class responsible for rendering trips and points of interest to the
 *  index page 
 */

class TripsRenderer {
    constructor() {
        this.$trips = $(".trips");
        this.$tripTemplate = $('#trip-template').html();
        this.$poiTemplate = $('#poi-template').html();
    }
 
    renderTrips(trips) {
        this.$trips.empty();
        let template = Handlebars.compile(this.$tripTemplate);
        for (let i = 0; i < trips.length; i++) {
          let newHTML = template(trips[i]);
        //   console.log(newHTML);
          this.$trips.append(newHTML);
          
          this.renderPoi(trips, i);
        }
    }

    renderPoi(trips, tripIndex) {
        let trip = $(".trip")[tripIndex];
        let $poiList = $(trip).find('.poi-list');
        $poiList.empty();
        let template = Handlebars.compile(this.$poiTemplate);
        for (let i = 0; i < trips[tripIndex].poi.length; i++) {
          let newHTML = template(trips[tripIndex].poi[i]);
          $poiList.append(newHTML);
        }
    }
}

export default TripsRenderer