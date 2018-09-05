
class EventsHandler {
    constructor(tripsRepository, tripsRenderer, ajaxUtil) {
        this.tripsRepository = tripsRepository;
        this.tripsRenderer = tripsRenderer;
        this.ajaxUtil = ajaxUtil;
        this.$trips = $(".trips");
    }
    //for creating a new trip without poi
    registerCreateTrip() {
        $('#add-trip-form').on('submit', (x) => {
            x.preventDefault();
            let tripName = $("#tripName").val();
            let tripStart = $("#start").val();
            let tripEnd = $("#end").val();
            let desc = $('#description').val();
            let newTrip = { name: tripName, fromDate: tripStart, toDate: tripEnd, description: desc };
            // console.log(newTrip);
            this.ajaxUtil.getAjax("POST", "/trips", newTrip, "json")
                .then((newDBObject) => {
                    // console.log("after ajax: "+JSON.stringify(newDBObject))
                    this.tripsRepository.addTrip(newDBObject);
                    // console.log(this.tripsRepository.trips);
                    this.tripsRenderer.renderTrips(this.tripsRepository.trips);
                    return;
                })
                .catch(err => { console.log(err) });
        });
    }

    registerSearchLocation() {
        $('#search').on('click', (x) => {
            x.preventDefault();
            let text = $('#searchText').val();
            console.log(text);
            let category = $('#categories').val();// todo debug
            console.log(category);
            this.ajaxUtil.getAjax("GET", "/external-location?q=" + text + "&catid=" + category)
                .then((res) => {
                    console.log(res);//todo debug

                })
                .catch(err => { console.log(err) });
        })
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
}

export default EventsHandler