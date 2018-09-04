const mongoose = require('mongoose');

let poiSchema = new mongoose.Schema({
    title: String,
    category: String,
    iconUrl: String,
    externalId: String,
    position: [Number],
    vicinity: String
});

let Poi = mongoose.model('poi', poiSchema);

module.exports = Poi;