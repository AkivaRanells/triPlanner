const express = require('express');
const request = require('request-promise-native');
const moment = require('moment');
const debug = require('debug')('triplanner');

const wrap = require("./middleware/wrap");
const private = require('./private');
const Trip = require('./models/trip-model');
const POI = require('./models/poi-model');

const router = express.Router();

const GEOCODE_BASE_URL = 'https://geocoder.api.here.com/6.2/geocode.json';
const EXPLORE_BASE_URL = 'https://places.api.here.com/places/v1/discover/explore';
const LOOKUP_BASE_URL = 'https://places.api.here.com/places/v1/places/lookup';
const CATEGORIES_BASE_URL = 'https://places.api.here.com/places/v1/categories/places';

const APP_ID = process.env.HERE_APP_ID || private.HERE_APP_ID;
const APP_CODE = process.env.HERE_APP_CODE || private.HERE_APP_CODE;

// Get POIs for given location, search external API - here.com
// ========== todo: handle paging
router.get('/external-location', wrap(async (req, res, next) => {
    // Get latitude and longitude for given search term
    const { q } = req.query;
    const positionUrl = `${GEOCODE_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&searchtext=${q}`;
    const positionOptions = {
        uri: positionUrl,
        qs: { q: q },
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    let result = await request(positionOptions);
    if (result.Response.View.length) {
        const { catid } = req.query;
        const position = result.Response.View[0].Result[0].Location.DisplayPosition;
        const poisUrl = `${EXPLORE_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&at=${position.Latitude},${position.Longitude}&cat=${catid}&show_refs=sharing`;
        const poisOptions = {
            uri: poisUrl,
            headers: { 'User-Agent': 'Request-Promise' },
            json: true
        };
        let rawPois = await request(poisOptions);
        const pois = [];
        rawPois.results.items.forEach(p => {
            const poi = {};
            poi.name = p.title;
            poi.category = p.category.title;
            poi.categoryIcon = p.icon;
            poi.externalId = p.references.sharing.id;
            poi.address = p.vicinity;
            pois.push(poi);
        });
        res.json(pois);
    }
    else {
        res.status(404).json({ message: 'Location not found' });
    }
}));

// Get POI by external ID, external API - here.com
router.get('/external-poi', wrap(async (req, res, next) => {
    const { poiid } = req.query;
    const poiUrl = `${LOOKUP_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&source=sharing&id=${poiid}`;
    const poiOptions = {
        uri: poiUrl,
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    let rawPoi = await request(poiOptions);
    const poi = {};
    poi.name = rawPoi.name;
    poi.category = rawPoi.categories[0].title;
    poi.categoryIcon = rawPoi.icon;
    poi.externalId = poiid;
    poi.position = rawPoi.location.position;
    poi.address = rawPoi.location.address.text;
    poi.city = rawPoi.location.address.city;
    poi.district = rawPoi.location.address.district;
    poi.country = rawPoi.location.address.country;
    poi.mapLink = rawPoi.view;
    res.json(poi);
}));

// Get available location categories from here.com
router.get('/categories', wrap(async (req, res, next) => {
    const categoryUrl = `${CATEGORIES_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}`;
    const categoryOptions = {
        uri: categoryUrl,
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    let response = await request(categoryOptions);
    const rawCategories = response.items;
    const categories = [];
    rawCategories.forEach(c => {
        if (!c.within.length) {
            const category = {};
            category.id = c.id;
            category.title = c.title;
            category.icon = c.icon;
            categories.push(category);
        }
    });
    categories.sort((a,b) => {
        return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);
    });
    res.json(categories);
}));

// Get all trips and their POIs
router.get('/trips', wrap(async (req, res, next) => {
    let trips = await Trip.find().populate('pois');
    res.json(trips);
}));

// Add a trip
router.post('/trips', wrap(async (req, res, next) => {
    const { name, description, fromDate, toDate } = req.body;
    const newTrip = new Trip({
        name: name,
        description: description,
        fromDate: moment(fromDate),
        toDate: moment(toDate),
        pois: []
    });
    let trip = await newTrip.save();
    res.status(201).json(trip);
}));

// Delete a trip
// ========== todo: also delete unused POIs from pois collection
router.delete('/trips/:tripId', wrap(async (req, res, next) => {
    const { tripId } = req.params;
    let trip = await Trip.findOneAndDelete({ _id: tripId });
    res.status(204).json(trip);
}));

// Add a POI to DB and reference it from a trip
router.post('/trips/:tripId/pois', wrap(async (req, res, next) => {
    const { tripId } = req.params;
    const { externalId } = req.body;
    // Check if POI already exists in DB, by externalId
    let poi = await POI.findOne({ externalId: externalId })
    if (poi) {
        // If it exists -> update ref in trip
        let trip = await Trip.findOneAndUpdate({ _id: tripId }, { $push: { pois: poi } }, { new: true });
        res.json(trip);
    }
    else {
        // If it doesn't exist -> create POI in DB and update ref in trip
        // Get POI's details from here.com
        const poiUrl = `${req.protocol}://${req.headers.host}/external-poi?poiid=${externalId}`;
        const poiOptions = {
            uri: poiUrl,
            headers: { 'User-Agent': 'Request-Promise' },
            json: true
        };
        let poi = await request(poiOptions);
        // Create new POI in DB
        const newPoi = new POI(poi);
        let createdPoi = await newPoi.save();
        // Update ref in trip
        let trip = await Trip.findOneAndUpdate({ _id: tripId }, { $push: { pois: createdPoi } }, { new: true });
        res.json(trip);
    }
}));

// Delete a POI
router.delete('/trips/:tripId/pois/:poiId', wrap(async (req, res, next) => {
    const { tripId, poiId } = req.params;
    let trip = await Trip.findOneAndUpdate({ _id: tripId }, { $pull: { pois: poiId } }, { new: true });
    // ========== todo: check if exists in other trips, otherwise delete POI
    res.status(204).json(trip);
}));

// Update a trip
router.put('/trips/:tripId', wrap(async (req, res, next) => {
    const { tripId } = req.params;
    const { name, description, fromDate, toDate } = req.body;
    const editedTrip = {
        name: name,
        description: description,
        fromDate: moment(fromDate),
        toDate: moment(toDate)
    };
    let trip = await Trip.findOneAndUpdate({ _id: tripId }, editedTrip, { new: true });
    res.status(201).json(trip);
}));

module.exports = router;