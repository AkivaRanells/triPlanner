const express = require('express');
const request = require('request-promise-native');
const moment = require('moment');
const debug = require('debug')('triplanner');

const private = require('./private');
const Trip = require('./models/trip-model');
const POI = require('./models/poi-model');

const router = express.Router();

const GEOCODE_BASE_URL = 'https://geocoder.api.here.com/6.2/geocode.json';
const EXPLORE_BASE_URL = 'https://places.api.here.com/places/v1/discover/explore';
const LOOKUP_BASE_URL = 'https://places.api.here.com/places/v1/places/lookup';
// todo: all categoris or user selects https://developer.here.com/documentation/places/topics/categories.html
const CATEGORIES = 'leisure-outdoor,eat-drink';
const APP_ID = process.env.HERE_APP_ID || private.HERE_APP_ID;
const APP_CODE = process.env.HERE_APP_CODE || private.HERE_APP_CODE;

// Get POIs for given location, search external API - here.com
// todo: convert to async/await
// todo: handle paging
router.get('/external-location', (req, res) => {
    // Get latitude and longitude for given search term
    const { q } = req.query;
    const positionUrl = `${GEOCODE_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&searchtext=${q}`;
    const positionOptions = {
        uri: positionUrl,
        qs: { q: q },
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    request(positionOptions)
        .then((result) => {
            const position = result.Response.View[0].Result[0].Location.DisplayPosition;
            return position;
        })
        .then((position) => {
            // Get POIs for latitude and longitude
            const poisUrl = `${EXPLORE_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&at=${position.Latitude},${position.Longitude}&cat=${CATEGORIES}&show_refs=sharing`;
            const poisOptions = {
                uri: poisUrl,
                headers: { 'User-Agent': 'Request-Promise' },
                json: true
            };
            request(poisOptions)
                .then((body) => {
                    const pois = [];
                    body.results.items.forEach(poi => {
                        const poiObj = {};
                        poiObj.name = poi.title;
                        poiObj.category = poi.category.title;
                        poiObj.categoryIcon = poi.icon;
                        poiObj.externalId = poi.references.sharing.id;
                        poiObj.address = poi.vicinity;
                        pois.push(poiObj)
                    });
                    res.json(pois);
                })
                .catch((err) => handleError(err));
        })
        .catch((err) => handleError(err));
});

// Get POI by external ID, external API - here.com
router.get('/external-poi', (req, res) => {
    const { poi } = req.query;
    const poiUrl = `${LOOKUP_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&source=sharing&id=${poi}`;
    const poiOptions = {
        uri: poiUrl,
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    request(poiOptions)
        .then((rawPoi) => {
            const poiObj = {};
            poiObj.name = rawPoi.name;
            poiObj.category = rawPoi.categories[0].title;
            poiObj.categoryIcon = rawPoi.icon;
            poiObj.externalId = poi;
            poiObj.position = rawPoi.location.position;
            poiObj.address = rawPoi.location.address.text;
            poiObj.city = rawPoi.location.address.city;
            poiObj.district = rawPoi.location.address.district;
            poiObj.country = rawPoi.location.address.country;
            poiObj.mapLink = rawPoi.view;
            res.json(poiObj);
        })
        .catch((err) => handleError(err));
});

// Get all trips and their POIs
router.get('/trips', (req, res) => {
    Trip.find()
        .populate('pois')
        .then(trips => res.json(trips))
        .catch(err => handleError(err));
});

// Add a trip
router.post('/trips', (req, res) => {
    const { name, description, fromDate, toDate } = req.body;
    const newTrip = new Trip({
        name: name,
        description: description,
        fromDate: moment(fromDate),
        toDate: moment(toDate),
        pois: []
    });
    newTrip.save()
        .then(trip => res.status(201).json(trip))
        .catch(err => handleError(err));
});

// Delete a trip
// todo: also delete unused POIs from pois collection
router.delete('/trips/:tripId', (req, res) => {
    const { tripId } = req.params;
    Trip.findOneAndDelete({ _id: tripId })
        .then(trip => res.status(204).json(trip))
        .catch(err => handleError(err));
});

// Add a POI to DB and reference it from a trip
router.post('/trips/:tripId/pois', (req, res) => {
    const { tripId } = req.params;
    const { externalId } = req.body;
    // Check if POI already exists in DB, by externalId
    POI.findOne({ externalId: externalId })
        .then(poi => {
            if (poi) {
                // If it exists -> update ref in trip
                Trip.findOneAndUpdate({ _id: tripId }, { $push: { pois: poi } }, { new: true })
                    .then(trip => res.json(trip))
                    .catch(err => handleError(err));
            }
            else {
                // If it doesn't exist -> create POI in DB and update ref in trip
                // Get POI's details from here.com
                const poiUrl = `${req.protocol}://${req.headers.host}/external-poi?poi=${externalId}`;
                const poiOptions = {
                    uri: poiUrl,
                    headers: { 'User-Agent': 'Request-Promise' },
                    json: true
                };
                request(poiOptions)
                    .then((poiObj) => {
                        const newPoi = new POI(poiObj);
                        newPoi.save()
                            .then(createdPoi => {
                                Trip.findOneAndUpdate({ _id: tripId }, { $push: { pois: createdPoi } }, { new: true })
                                    .then(trip => res.json(trip))
                                    .catch(err => handleError(err));
                            })
                            .catch((err) => handleError(err));
                    })
                    .catch((err) => handleError(err));
            }
        })
        .catch(err => handleError(err));
});

// Delete a POI
router.delete('/trips/:tripId/pois/:poiId', (req, res) => {
    const { tripId, poiId } = req.params;
    Trip.findOneAndUpdate({ _id: tripId }, { $pull: { pois: poiId } }, { new: true })
        // todo: also delete unused POIs from pois collection
        .then(trip => res.status(204).json(trip))
        .catch(err => handleError(err));
});

// Update a trip
router.put('/trips/:tripId', (req, res) => {
    const { tripId } = req.params;
    const { name, description, fromDate, toDate } = req.body;
    const editedTrip = {
        name: name,
        description: description,
        fromDate: moment(fromDate),
        toDate: moment(toDate)
    };
    Trip.findOneAndUpdate({ _id: tripId }, editedTrip, { new: true })
        .then(trip => res.status(201).json(trip))
        .catch(err => handleError(err));
});

// General error handling function
function handleError(err) {
    console.error(err);
    throw err;
}

module.exports = router;