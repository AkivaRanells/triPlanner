import TripsRepository from './trips-repository.js';
import TripsRenderer from './trips-renderer.js';
import AjaxUtil from './ajax-util.js';
import EventsHandler from './events-handler.js';
let tripsRepository = new TripsRepository();
let tripsRenderer = new TripsRenderer();
let ajaxUtil = new AjaxUtil();
let eventsHandler = new EventsHandler(tripsRepository,tripsRenderer, ajaxUtil);
eventsHandler.registerCreateTrip();
tripsRenderer.renderTrips(tripsRepository.trips);

//pull database data on init
let init =()=> ajaxUtil.getAjax("GET", "/trips");
init()
.then(res=>{
    console.log(res);
    tripsRepository.trips=res;
    tripsRenderer.renderTrips(tripsRepository.trips);
})
.catch(err=>{console.log(err)});