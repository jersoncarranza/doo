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
var md_upload = multipart(
    console.log('hok'),
    {uploadDir: false}
    );
//var md_upload = multipart({uploadDir:'./uploads/users'});

const multer = require('multer');
var upload = multer({dest:'uploads/'});
var cpUpload = upload.single('fileKey');

const DIR = './uploads';
 
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
//     }
// });
//let upload = multer({storage: storage});

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, "./public/uploads");
    },
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  var imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  var upload = multer({ storage: storage, fileFilter: imageFilter});
  


api.post('/save-user', userController.saveUser);
api.post('/save-modelo', userController.saveModelo);
api.post('/login', userController.loginUser);
api.post('/edit-preferencia-sexo',userMiddleware.ensureAuth, userController.editPreferenciaSexo);
api.put('/edit-user/:id', userMiddleware.ensureAuth, userController.updateUser);
api.get('/get-user/:id', userMiddleware.ensureAuth, userController.getUserModelo);

api.put('/edit-red', userMiddleware.ensureAuth, userController.updateRedSocial);

api.get('/users/:page?', userMiddleware.ensureAuth, userController.getUsersPage);
//api.post('/upload-pay-cloudinary/:id',[md_upload],userController.uploadPayCloudinary);
api.post('/upload-pay-cloudinary/:id',[md_upload], userController.uploadPayCloudinary);

api.post('/upload-pay-cloudinary-2/:id',[md_upload],userController.uploadPayCloudinary);

//Subir Fotos  - modelos
api.post('/upload-user-cloudinary/:id', [md_upload],userController.uploadCloudinary);
api.get('/modelo/:page?', userMiddleware.ensureAuth, userController.getModeloPage);
api.post('/upload-model-dni/:id', [md_upload],userController.uploadDNI);
api.put('/edit-user-modelo/:id', userMiddleware.ensureAuth, userController.updateUserModel);


//Admin
api.get('/users-client/:page?', userMiddleware.ensureAuth, userController.getUsersClientPage);
api.post('/change-estado',      userMiddleware.ensureAuth, userController.changeEstadoUser);


api.post('/upload-pay-cloudinary-2/:id', function (req, res) {
        var userId = req.params.id;
        var file_path = req.file.image.path;
        var file_path = req.file.originalname;

        /*
        upload(req, res, function(err) {
            if(err){
                return res.end("Error uploading file");
            }
        })
        */


        cloudinary.config({ 
            cloud_name: conf.cloudinary.name ,  
            api_key: conf.cloudinary.key, 
            api_secret: conf.cloudinary.secret,
            uploadOptions: {
                folder: 'pay'
            }
        });
     
        cloudinary.uploader.upload(file_path,  function(result) {                 
            
            if (result) {
                return res.status(200).send({status:1});        
            }else{
                return res.status(200).send({status:0});        

            }        
        });
    
});

api.post('/uploads', async (req, res) => {
    
    cloudinary.config({ 
    cloud_name: "djempmk2c", 
    api_key: "429628637822674", 
    api_secret: "jdxpup4Mm4jRigo87M3pMN6Rgzo"
    });
    let filePaths = req.body.filePaths;            
    let multipleUpload = new Promise(async (resolve, reject) => {
        let upload_len = filePaths.length
  ,upload_res = new Array();

    for(let i = 0; i <= upload_len + 1; i++)
    {
        let filePath = filePaths[i];
        await cloudinary.v2.uploader.upload(filePath, (error, result) => {

            if(upload_res.length === upload_len)
            {
            /* resolve promise after upload is complete */
            resolve(upload_res)
            }else if(result)
            {
            /*push public_ids in an array */  
            upload_res.push(result.public_id);
            } else if(error) {
            console.log(error)
            reject(error)
            }

        })
        
    } 
    })
    .then((result) => result)
    .catch((error) => error)

    let upload = await multipleUpload;
    res.json({'response':upload})
});

api.post('upload',upload.single('photo'), function (req, res) {
    console.log("paso por aqui");
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
    
      } else {
        console.log('file received successfully');
        return res.send({
          success: true
        })
      }
});


api.post('/image', cpUpload, function(req,res){

    console.log(req.file);
    return res.status(200).send({status:1}); 
  
  })
module.exports = api;