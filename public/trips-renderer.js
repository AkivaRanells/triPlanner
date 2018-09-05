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
        this.$searchResults = $('#searchResults');
        this.$searchResultsTemplate = $('#search-results-template').html();
        this.$tripPoisTemplate = $('#trip-pois-template').html();
        this.$clickedResults = $('#bodyClickedResultModal');
        this.$clickedResultsTemplate = $('#clicked-result-template').html();
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
        let newHTML = template({categories: categories});
        // console.log(newHTML);
        this.$categories.append(newHTML);
    }

    renderSearchResults(results){
        this.$searchResults.empty();
        let template = Handlebars.compile(this.$searchResultsTemplate);
        let newHTML = template({results: results});
        this.$searchResults.append(newHTML);
    }
    renderTripPois(trip) {
        this.$tripPois.empty();
        let template = Handlebars.compile(this.$tripPoisTemplate);
        let newHTML = template({ pois: trip.pois });
        this.$tripPois.html(newHTML);
    }

    renderClickedResult(poi){
        this.$clickedResults.empty();
        let template = Handlebars.compile(this.$clickedResultsTemplate);
        let newHTML = template(poi);
        this.$clickedResults.html(newHTML);
    }
}

export default TripsRenderer