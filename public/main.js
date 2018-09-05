import TripsRepository from './trips-repository.js';
import TripsRenderer from './trips-renderer.js';
import AjaxUtil from './ajax-util.js';
import EventsHandler from './events-handler.js';

let tripsRepository = new TripsRepository();
let tripsRenderer = new TripsRenderer();
let ajaxUtil = new AjaxUtil();
let eventsHandler = new EventsHandler(tripsRepository, tripsRenderer, ajaxUtil);

eventsHandler.registerCreateTrip();
eventsHandler.registerSearchLocation();
eventsHandler.registerSearchResults();
eventsHandler.registerSelectTrip();
eventsHandler.registerDeleteTrip();
eventsHandler.registerDeletePoi();
eventsHandler.registerAddPoiToTrip();
eventsHandler.registerAddPoiToTripFromModal();
//pull trips from database on init
let initTrips = () => ajaxUtil.getAjax("GET", "/trips");
initTrips()
    .then(res => {
        if (res.length) {
            tripsRepository.trips = res;
            tripsRenderer.renderTrips(tripsRepository.trips);
            tripsRenderer.renderTripPois(tripsRepository.trips[0]);
            $('#tripsWrapper').show();
            $('#tripSelector').show();
        }
        else {
            $('#emptyMessage').show();
        }
    })
    .catch(err => { console.log(err) });

let initCategories = () => ajaxUtil.getAjax("GET", "/categories");
initCategories()
    .then((categories) => {
        tripsRenderer.renderCategories(categories);//todo debug
    })
    .catch(err => { console.log(err) });



    