
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
                this.ajaxUtil("POST", "/trips", newTrip, "json")
                    .then((newDBObject) => {
                        console.log("after ajax: "+JSON.stringify(newDBObject))
                        this.tripsRepository.addPost(newDBObject);
                        console.log(this.tripsRepository.posts);
                        this.tripsRenderer.renderPosts(this.tripsRepository.trips);
                        return;
                    })
        });
    }

    registerSearchLocation(){

    }

}

export default EventsHandler