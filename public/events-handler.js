
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
            let tripName = $("#trip-name").val();
            let tripStart = $("#start").val();
            let tripEnd = $("#end").val();
            let desc = $('#description').val();
            let newTrip = {name:tripName, fromDate:tripStart,toDate:tripEnd,description:desc};
            // console.log(newTrip);
                this.ajaxUtil.getAjax("POST", "/trips", newTrip, "json")
                    .then((newDBObject) => {
                        console.log("after ajax: "+JSON.stringify(newDBObject))
                        this.tripsRepository.addTrip(newDBObject);
                        console.log(this.tripsRepository.trips);
                        this.tripsRenderer.renderTrips(this.tripsRepository.trips);
                        return;
                    })
        });
    }

    registerSearchLocation(){

    }

    register

}

export default EventsHandler