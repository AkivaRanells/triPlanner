
class EventsHandler {
    constructor(tripsRepository, tripsRenderer, ajaxUtil) {
        this.tripsRepository = tripsRepository;
        this.tripsRenderer = tripsRenderer;
        this.ajaxUtil = ajaxUtil;
        this.$trips = $(".trips");
        // this.chosenTripId = '';
    }
    //for creating a new trip without poi
    registerCreateTrip() {
        $('#add-trip-form').on('submit', (e) => {
            e.preventDefault();
            let tripName = $("#tripName").val();
            let tripStart = $("#start").val();
            let tripEnd = $("#end").val();
            let desc = $('#description').val();
            let newTrip = { name: tripName, fromDate: tripStart, toDate: tripEnd, description: desc };
            this.ajaxUtil.getAjax("POST", "/trips", newTrip, "json")
                .then((newDBObject) => {
                    this.tripsRepository.addTrip(newDBObject);
                    this.tripsRenderer.renderTrips(this.tripsRepository.trips);
                    $('#exampleModal').modal('hide');
                })
                .catch(err => { console.log(err) });
        });
    }

    registerSearchLocation() {
        $('#searchForm').on('submit', (x) => {
            x.preventDefault();
            let text = $('#searchText').val();
            let category = $('#categories').val();// todo debug
            this.ajaxUtil.getAjax("GET", "/external-location?q=" + text + "&catid=" + category)
                .then((res) => {
                    this.tripsRenderer.renderSearchResults(res);
                })
                .catch(err => { console.log(err) });
        })
    }

    registerSearchResults() {

    }

    registerAddPoiToTrip() {

    }


    registerSelectTrip() {
        $('#tripSelector').on('change', event => {
            const tripId = $(event.currentTarget).val();
            const trip = this.tripsRepository.getTripById(tripId);
            this.tripsRenderer.renderTripPois(trip);
        });
    }






    registerDeleteTrip() {
        $('#tripPois').on('click', '#deleteBtn', event => {
            const tripId = $(event.currentTarget).closest('.trip-details').data().id;
            this.ajaxUtil.getAjax("DELETE", `/trips/${tripId}`)
                .then(response => {
                    this.tripsRepository.removeTrip(tripId);
                    this.tripsRenderer.renderTrips(this.tripsRepository.trips);
                    if (this.tripsRepository.trips.length) {
                        this.tripsRenderer.renderTripPois(this.tripsRepository.trips[0]);
                    }
                    else {
                        $('#tripsWrapper').hide();
                        $('#tripSelector').hide();
                        $('#emptyMessage').show();
                    }
                })
                .catch(err => { console.log(err) });
        });
    }

}




export default EventsHandler