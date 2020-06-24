'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = ({
    name:       String,
    estado:     Number,
    population: String,
    idCountry: {type: Schema.ObjectId, ref:'Country'}
});

module.exports = mongoose.model('City', CitySchema);