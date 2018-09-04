const express = require('express');
const request = require('request-promise-native');
const private = require('./private');

const router = express.Router();

const GEOCODE_BASE_URL = 'https://geocoder.api.here.com/6.2/geocode.json';
const EXPLORE_BASE_URL = 'https://places.api.here.com/places/v1/discover/explore';
const APP_ID = process.env.HERE_APP_ID || private.HERE_APP_ID;
const APP_CODE = process.env.HERE_APP_CODE || private.HERE_APP_CODE;


// Get POIs for given location, search external API - here.com
router.get('/external-pois', (req, res) => { //todo: convert to async/await
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
            const poisUrl = `${EXPLORE_BASE_URL}?app_id=${APP_ID}&app_code=${APP_CODE}&at=${position.Latitude},${position.Longitude}`;
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
                .catch((err) => { throw err });;
        })
        .catch((err) => { throw err });
});

module.exports = router;