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
// todo: all categoris or user selects https://developer.here.com/documentation/places/topics/categories.html
const CATEGORIES = 'leisure-outdoor,eat-drink';
const APP_ID = process.env.HERE_APP_ID || private.HERE_APP_ID;
const APP_CODE = process.env.HERE_APP_CODE || private.HERE_APP_CODE;

// Get POIs for given location, search external API - here.com
// todo: convert to async/await
// todo: handle paging
router.get('/external-pois', (req, res) => {
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
            const poisUrl = `${EXPLORE_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&at=${position.Latitude},${position.Longitude}&cat=${CATEGORIES}`;
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
                        poiObj.title = poi.title;
                        poiObj.category = poi.category.title;
                        poiObj.iconUrl = poi.icon;
                        poiObj.externalId = poi.id;
                        poiObj.position = poi.position;
                        poiObj.vicinity = poi.vicinity;
                        pois.push(poiObj)
                    });
                    res.json(pois);
                })
                .catch((err) => handleError(err));
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

// Add a POI and reference it in a trip
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

            }
        })
        .catch(err => handleError(err));
});

// General error handling function
function handleError(err) {
    console.error(err);
    throw err;
}

module.exports = router;