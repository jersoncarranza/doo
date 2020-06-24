'use strict';
var mongoose = require('mongoose');

var CountrySchema = ({
    estado:     Number,
    status:     String,
    capital:    String,
    code:       String,
    name:       String,
    phone_code: String,
    continentName:  String,
    continentCode:  String,
    continentGeo:   String,
    population:     String
 
});

module.exports = mongoose.model('Country', CountrySchema);