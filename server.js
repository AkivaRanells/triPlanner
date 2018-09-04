const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');

const SERVER_PORT = process.env.PORT || 8080;
const DB_URI = process.env.CONNECTION_STRING || 'mongodb://localhost/triplanner';

const dbPromise = mongoose.connect(DB_URI, { useMongoClient: true });
dbPromise.then((db) => console.log(`${getTimestamp()} - Connection to DB '${db.name}' established`));

// const tripsApi = require("./trips-api");

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/", tripsApi);
// Error handling
app.use(function (req, res) { res.status(404).send('Page not found (404)'); });
app.use(function (error, req, res, next) { res.status(500).send('An error has occured (500)'); });

app.listen(SERVER_PORT, () => { console.log(`${getTimestamp()} - Server started on port ${SERVER_PORT}`) });

function getTimestamp() { return moment().format("YYYY-MM-DD HH:mm:ss") }