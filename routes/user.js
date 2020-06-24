'use strict';
var express = require('express');
var api = express.Router();
var userController = require('../controllers/userCntrl');
var userMiddleware = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart();
//var md_upload = multipart({uploadDir:'./uploads/users'});

api.post('/save-user', userController.saveUser);
api.post('/save-modelo', userController.saveModelo);
api.post('/login', userController.loginUser);
api.post('/edit-preferencia-sexo',userMiddleware.ensureAuth, userController.editPreferenciaSexo);
api.put('/edit-user/:id', userMiddleware.ensureAuth, userController.updateUser);
api.get('/get-user/:id', userMiddleware.ensureAuth, userController.getUserModelo);

api.put('/edit-red', userMiddleware.ensureAuth, userController.updateRedSocial);

api.get('/users/:page?', userMiddleware.ensureAuth, userController.getUsersPage);
api.post('/upload-pay-cloudinary/:id',[md_upload],userController.uploadPayCloudinary);

//Subir Fotos  - modelos
api.post('/upload-user-cloudinary/:id', [md_upload],userController.uploadCloudinary);
api.get('/modelo/:page?', userMiddleware.ensureAuth, userController.getModeloPage);
api.post('/upload-model-dni/:id', [md_upload],userController.uploadDNI);
api.put('/edit-user-modelo/:id', userMiddleware.ensureAuth, userController.updateUserModel);


//Admin
api.get('/users-client/:page?', userMiddleware.ensureAuth, userController.getUsersClientPage);
api.post('/change-estado',      userMiddleware.ensureAuth, userController.changeEstadoUser);



module.exports = api;