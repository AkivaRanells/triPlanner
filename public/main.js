import TripsRepository from './trips-repository';
import TripsRenderer from './trips-renderer';

let tripsRepository = new TripsRepository();
let tripsRenderer = new TripsRenderer();

import AjaxUtil from './ajax-util';
let ajaxUtil = new AjaxUtil();
ajaxUtil.getAjax();