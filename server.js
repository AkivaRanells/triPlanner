const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');

const SERVER_PORT = process.env.PORT || 8080;
const DB_URI = process.env.CONNECTION_STRING || 'mongodb://localhost/triplanner';

const dbPromise = mongoose.connect(DB_URI, { useNewUrlParser: true });
dbPromise.then((db) => console.log(`${getTimestamp()} - Connected to DB '${db.connections[0].name}'`));

const tripsApi = require("./trips-api");
const initializer = require("./initializer");

// Initialize the DB with dummy data, run only once
// initializer.initDB();

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", tripsApi);
// Error handling
app.use(function (req, res) { res.status(404).json({ message: 'Page not found' }); });
app.use(function (error, req, res, next) {
    res.status(500).json({
        message: 'An error has occured',
        error: error
    });
});

app.listen(SERVER_PORT, () => { console.log(`${getTimestamp()} - Server started on port ${SERVER_PORT}`) });


function getTimestamp() { return moment().format("YYYY-MM-DD HH:mm:ss") }