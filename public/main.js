import TripsRepository from './trips-repository.js';
import TripsRenderer from './trips-renderer.js';
import AjaxUtil from './ajax-util.js';
import EventsHandler from './events-handler.js';
let tripsRepository = new TripsRepository();
let tripsRenderer = new TripsRenderer();
let ajaxUtil = new AjaxUtil();
let eventsHandler = new EventsHandler(tripsRepository,tripsRenderer);
eventsHandler.registerCreateTrip();
tripsRenderer.renderTrips(tripsRepository.trips);


// ajaxUtil.getAjax();