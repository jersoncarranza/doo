'use strict';
var User = require('../models/user');
var cloudinary = require('cloudinary');
var conf    = require('../conf.json');

    function getModelsPage(req, res){
        var identity_user_id = req.user.sub;
        var page = 1;

        let query = {tipo:8, estado:1 }// 8 son modelos:  7Clientes
        var itemsPerPage = 12;
        if(req.params.page){ page= req.params.page; };
        User.find(query).sort('_id').paginate(page, itemsPerPage, (err, users, total)=>{
            if(err) return res.status(500).send({message: 'Error de la peticion', status:0});
            if(!users) return res.status(404).send({message:'No hay usuarios disponibles', status:0});
            return res.status(200).send({
                users,
                total:total ,
                pages: Math.ceil(total/itemsPerPage),
                status:1
            })
        })
    }

    function getUsersClientPage(req, res){
        var identity_user_id = req.user.sub;
        var page = 1;

        let query = {tipo:7 }// 8 son modelos:  7Clientes
        var itemsPerPage = 20;
        if(req.params.page){ page= req.params.page; };
        User.find(query).sort('_id').paginate(page, itemsPerPage, (err, users, total)=>{
            if(err) return res.status(500).send({message: 'Error de la peticion', status:0});
            if(!users) return res.status(404).send({message:'No hay usuarios disponibles', status:0});
            return res.status(200).send({
                users,
                total:total ,
                pages: Math.ceil(total/itemsPerPage),
                status:1
            })
        })
    }

    function changeEstadoUser(req, res,next){
        let iduser = req.body.iduser;
        let estado = req.body.estado;
        let condition           =   {_id    :   iduser};
        let query               =   {estado :   estado};

        User.updateOne(condition, query, (err, userUpdated) =>{
            if(err) return res.status(505).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
            if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario', status:0});
            return res.status(200).send({user:userUpdated, status:1});
        });
    }


    function getModelsPageAll(req, res){
        var page = 1;
        let query = {tipo:8 }// 8 son modelos:  7Clientes
        var itemsPerPage = 12;
        if(req.params.page){ page= req.params.page; };
        User.find(query).sort('_id').paginate(page, itemsPerPage, (err, users, total)=>{
            if(err) return res.status(500).send({message: 'Error de la peticion', status:0});
            if(!users) return res.status(404).send({message:'No hay usuarios disponibles', status:0});
            return res.status(200).send({
                users,
                total:total ,
                pages: Math.ceil(total/itemsPerPage),
                status:1
            })
        })
    }
    module.exports = {
        getModelsPage,
        getUsersClientPage,
        changeEstadoUser,
        getModelsPageAll
    }