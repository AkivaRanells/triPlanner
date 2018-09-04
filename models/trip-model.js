const mongoose = require('mongoose');

let tripSchema = new mongoose.Schema({
    name: String,
    description: String,
    fromDate: Date,
    toDate: Date, //todo: limit to >= fromDate
    pois: [{ type: mongoose.Schema.Types.ObjectId, ref: 'poi' }]
});

let Trip = mongoose.model('trip', tripSchema);

module.exports = Trip;