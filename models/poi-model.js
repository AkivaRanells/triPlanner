const mongoose = require('mongoose');

let poiSchema = new mongoose.Schema({
    name: String,
    category: String,
    categoryIcon: String,
    externalId: String,
    position: [Number],
    address: String,
    country: String,
    mapLink: String
});

let Poi = mongoose.model('poi', poiSchema);

module.exports = Poi;