'use strict';
var Country = require('../models/country')
var City = require('../models/city')

    function saveCountry(req, res){
        var country         = new Country();
        var countryParams   = req.body;

        console.log('culanto'+countryParams.name);
        country.name        = countryParams.name;
        country.capital     = countryParams.capital;
        country.code        = countryParams.code;
        country.population  = countryParams.population;
        country.status      = 'success';
        country.continentName   = countryParams.continentName;
        country.continentCode   = countryParams.continentCode;
        country.estado      = 1;
      
        country.save((err, countryStored) =>{
            if(err) return res.status(500).send({message:'Error en la peticion '+err,status:0,});
            if(!countryStored) return res.status(500).send({message:'Error al save'+ err,status:0,});
            
            return res.status(200).send({
                country:countryStored,
                status:1,
                message:'ok'
            });
        });  
    };

    function getCountries(req, res){
     
        Country.find({estado:1}, (err, countryList)=>{
            if(err) return res.status(404).send({message:'Error devolver publicaciones'+err});
            if(!countryList) return res.status(500).send({message:'No hay publicaciones'});
        
            return res.status(200).send( {
                message:'ok',
                countryList
                }
            ) 
        })
    
    };

    function getCountryId(req,res){
        var countryId = req.params.id;
        Country.findById(countryId, (err, countryList)=>{
            if(err) return res.status(404).send({message:'Error devolver publicaciones'+err});
            if(!countryList) return res.status(500).send({message:'No hay publicaciones'});
            return res.status(200).send({
                countryList,
                message:'ok'
            })
        });
    }

    function updateCountry(req, res){
        var idCountry= req.params.id;
        var update= req.body;
        
        Country.findOneAndUpdate({_id:idCountry}, update,{new:true}, (err, countryUpdated) =>{
            if(err) return res.status(505).send({message:'No tienes permiso'});
            if(!countryUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
            return res.status(200).send({
                country:countryUpdated,
                message:'ok'
            });
        });
    }
    
    
    //Ciudades
    function saveCity(req, res){
        var city         = new City();
        var body         = req.body;
        var countryParams= req.params.id;
        city.name        = body.name;
        city.estado      = 1;
        city.population  = body.population;
        city.idCountry   = countryParams;
      
        city.save((err, cityStored) =>{
            if(err) return res.status(500).send({message:'Error guardar ciudad '+err,status:0,});
            if(!cityStored) return res.status(500).send({message:'Retirna vacio ciudad '+ err,status:0,});
            
            return res.status(200).send({
                city:cityStored,
                status:1,
                message:'ok'
            });
        });  
    };

    
    function getCities(req, res){
        var countryCode= req.params.id;
        City.find({estado:1 , idCountry:countryCode}, (err, citiesList)=>{
            if(err) return res.status(404).send({message:'Error devolver las cities'+err});
            if(!citiesList) return res.status(500).send({message:'No hay cities'});
            return res.status(200).send( {
                message:'ok',
                citiesList,
                status:1
                }
            ) 
        })
    
    };

    function getCityId(req,res){
        var cityId = req.params.id;
        City.findById(cityId, (err, cityOne)=>{
            if(err) return res.status(404).send({message:'Error devolver publicaciones'+err});
            if(!cityOne) return res.status(500).send({message:'No hay publicaciones'});
            return res.status(200).send({
                city:cityOne,
                message:'ok',
                status:1
            })
        });
    }

    function updateCity(req, res){
        var idCountry   = req.params.id;
        var update      = req.body;
        
        City.findOneAndUpdate({_id:idCountry}, update,{new:true}, (err, cityUpdated) =>{
            if(err) return res.status(505).send({message:'No tienes permiso'});
            if(!cityUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
            return res.status(200).send({
                city:cityUpdated,
                message:'ok'
            });
        });
    }


    module.exports ={
        saveCountry,
        getCountries,
        getCountryId,
        updateCountry,
        ///
        saveCity,
        getCities,
        getCityId,
        updateCity

    }