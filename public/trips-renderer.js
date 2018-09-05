/**
 * @class responsible for rendering trips and points of interest to the
 *  index page 
 */

class TripsRenderer {
    constructor() {
        this.$trips = $("#tripSelector");
        this.$tripPois = $("#tripPois");
        this.$tripTemplate = $('#trip-select-template').html();
        this.$poiTemplate = $('#poi-template').html();
        this.$categories = $('#categories');
        this.$categoryTemplate = $('#category-template').html();
        this.$tripPoisTemplate = $('#trip-pois-template').html();
    }

    renderTrips(trips) {
        this.$trips.empty();
        let template = Handlebars.compile(this.$tripTemplate);
        let newHTML = template({ trips: trips });
        this.$trips.html(newHTML);
    }

    renderPoi(trips, tripIndex) {
        let trip = $(".trip")[tripIndex];
        let $poiList = $(trip).find('.poi-list');
        $poiList.empty();
        let template = Handlebars.compile(this.$poiTemplate);
        for (let i = 0; i < trips[tripIndex].pois.length; i++) {
            let newHTML = template(trips[tripIndex].pois[i]);
            $poiList.after(newHTML);
        }
    }

    renderCategories(categories) {
        this.$categories.empty();
        let template = Handlebars.compile(this.$categoryTemplate);
        let newHTML = template({ categories: categories });
        // console.log(newHTML);
        this.$categories.append(newHTML);
    }

    renderSearchResults() {

    }

    renderTripPois(trip) {
        this.$tripPois.empty();
        let template = Handlebars.compile(this.$tripPoisTemplate);
        let newHTML = template({ pois: trip.pois });
        this.$tripPois.html(newHTML);
    }
}

export default TripsRenderer