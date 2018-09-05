
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
                    const newId = this.tripsRepository.addTrip(newDBObject);
                    this.tripsRenderer.renderTrips(this.tripsRepository.trips);
                    this.tripsRenderer.renderTripPois(this.tripsRepository.getTripById(newId));
                    $("#tripSelector").val(newId).show();
                    $('#tripsWrapper').show();
                    $('#emptyMessage').hide();
                    $('#exampleModal').modal('hide');
                    $(e.currentTarget)[0].reset();
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
        $('#searchResults').on('click', 'a', (e) => {
            e.preventDefault();
            let externalId = $(e.currentTarget).data().id;
            this.ajaxUtil.getAjax("GET", "/external-poi?poiid=" + externalId)
                .then((res) => {
                    this.tripsRenderer.renderClickedResult(res);
                })
                .catch(err => { console.log(err) });
        })
    }

    registerAddPoiToTrip() {
        $('#searchResults').on('click', '.btn-info', (e)=>{
            e.preventDefault();
            let tripId = $('#tripSelector').val();
            let externalId = $(e.currentTarget).closest('li').find('a').data().id;
            this.ajaxUtil.getAjax("POST","/trips/"+tripId+"/pois", {externalId:externalId}, "json")
            .then((res)=>{
                this.tripsRepository.addPoi(res, tripId);
                const trip = this.tripsRepository.getTripById(tripId);
                this.tripsRenderer.renderTripPois(trip);
            })
            .catch(err=>{console.log(err)});
        })
    }

    registerAddPoiToTripFromModal() {
        $('#addPoiFromModal').on('click', (e)=>{
            e.preventDefault();
            let tripId = $('#tripSelector').val();
            let externalId = $(e.currentTarget).closest('.modal-content').find('.container-fluid').data().id;
            this.ajaxUtil.getAjax("POST","/trips/"+tripId+"/pois", {externalId:externalId}, "json")
            .then((res)=>{
                this.tripsRepository.addPoi(res, tripId);
                const trip = this.tripsRepository.getTripById(tripId);
                this.tripsRenderer.renderTripPois(trip);
                $('#clickedResultModal').modal('hide');
            })
            .catch(err=>{console.log(err)});
        })
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

    registerDeletePoi() {
        $('#tripPois').on('click', '.delete-poi', event => {
            const tripId = $('#tripSelector').val();
            const poiId = $(event.currentTarget).closest('.poi-details').data().id;
            this.ajaxUtil.getAjax("DELETE", `/trips/${tripId}/pois/${poiId}`)
                .then(response => {
                    this.tripsRepository.removePoi(tripId, poiId);
                    this.tripsRenderer.renderTripPois(this.tripsRepository.getTripById(tripId));
                })
                .catch(err => { console.log(err) });
        });
    }

}




export default EventsHandler