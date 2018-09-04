
class EventsHandler {
    constructor(tripsRepository, tripsRenderer) {
        this.tripsRepository = tripsRepository;
        this.tripsRenderer = tripsRenderer;
        this.$trips = $(".trips");
    }

    registerCreateTrip() {
        $('#add-trip').on('click', () => {
            let tripName = $("#trip-name");
            let tripStart = $("#start");
            let tripStart = 
            let newTrip = {name:}
            if ($input.val() === "") {
                alert("Please enter text!");
            } else {
                //this.tripsRepository.addPost($input.val())        
                let theData = { text: $input.val(), comments: [] };
                // console.log(theData);
                let pushToDB = new AjaxRequests('/posts', "POST", theData);
                pushToDB.postAjax()
                    .then((newDBObject) => {
                        // console.log("after ajax: "+JSON.stringify(newDBObject))
                        this.tripsRepository.addPost(newDBObject);
                        // console.log(this.tripsRepository.posts);
                        this.tripsRenderer.renderPosts(this.tripsRepository.posts);
                        return;
                    })
            }
        });
    }

    registerSearchLocation(){

    }

}

export default EventsHandler