'use strict';
var express = require('express');
var cloudinary = require('cloudinary');
var User = require('../models/user');
const path = require('path');
var api = express.Router();
var conf    = require('../conf.json');
var userController = require('../controllers/userCntrl');
var userMiddleware = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart( );

const multer = require('multer');
var memoryStorage = multer.memoryStorage();

var memoryUpload = multer({
    storage: memoryStorage,
    limits: {fileSize: 1500000, files: 1}
   }).single('image');
   
  cloudinary.config({
     cloud_name: 'djempmk2c',
     api_key: '429628637822674',
     api_secret: 'jdxpup4Mm4jRigo87M3pMN6Rgzo'


   });
 
   api.post('/upload',memoryUpload, (req, res ) =>{
    console.log(req.body.nam);
    var file_path = req.file.mimetype;
    var format    = file_path.split('/');
    cloudinary.v2.uploader
        .upload_stream({ format: format[1] ,folder: 'pay'}, (error, result) => { 
        if (result) {
            console.log(result);
            return res.status(200).send({status:1}); 
            
        }else{
            console.log(error);
            return res.status(200).send({status:0}); 
        }

   }).end(req.file.buffer);
  
});


api.post('/save-user', userController.saveUser);
api.post('/save-modelo', userController.saveModelo);
api.post('/login', userController.loginUser);
api.post('/edit-preferencia-sexo',userMiddleware.ensureAuth, userController.editPreferenciaSexo);
api.put('/edit-user/:id', userMiddleware.ensureAuth, userController.updateUser);
api.get('/get-user/:id', userMiddleware.ensureAuth, userController.getUserModelo);

api.put('/edit-red', userMiddleware.ensureAuth, userController.updateRedSocial);

api.get('/users/:page?', userMiddleware.ensureAuth, userController.getUsersPage);
//api.post('/upload-pay-cloudinary/:id',[md_upload],userController.uploadPayCloudinary);
api.post('/upload-pay-cloudinary', memoryUpload, userController.uploadPayCloudinary);

api.post('/upload-pay-cloudinary-2/:id',[md_upload],userController.uploadPayCloudinary);

//Subir Fotos  - modelos
api.post('/upload-user-cloudinary/:id', [md_upload],userController.uploadCloudinary);
api.get('/modelo/:page?', userMiddleware.ensureAuth, userController.getModeloPage);
api.post('/upload-model-dni/:id', [md_upload],userController.uploadDNI);
api.put('/edit-user-modelo/:id', userMiddleware.ensureAuth, userController.updateUserModel);


//Admin
api.get('/users-client/:page?', userMiddleware.ensureAuth, userController.getUsersClientPage);
api.post('/change-estado',      userMiddleware.ensureAuth, userController.changeEstadoUser);





module.exports = api;