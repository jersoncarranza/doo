'use strict';
var express = require('express');
var CountryController = require('../controllers/countryCntrl');
var api = express.Router();

api.post('/save-country',  CountryController.saveCountry);
api.get('/get-countries',  CountryController.getCountries);
api.get('/get-country/:id',  CountryController.saveCountry);
api.post('/update-country/:id',  CountryController.updateCountry);
//city
api.post('/save-city/:id',  CountryController.saveCity);
api.get('/get-cities/:id',  CountryController.getCities);
api.get('/get-city/:id',  CountryController.getCityId);
api.post('/update-city/:id',  CountryController.updateCity);


module.exports = api;