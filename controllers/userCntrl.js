'use strict';
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var jwt  = require('../services/jwt');
var conf    = require('../conf.json');
var cloudinary = require('cloudinary');
var mongoosePaginate = require('mongoose-pagination');


  cloudinary.config({
     cloud_name: 'djempmk2c',
     api_key: '429628637822674',
     api_secret: 'jdxpup4Mm4jRigo87M3pMN6Rgzo'
   });


function saveUser(req, res){
    var params = req.body;
    var userSave = new User();
    if(params.email && params.password){
        userSave.nombres         = params.nombres;
        userSave.sexo            = params.sexo; // 1 Hombre ; 0 Mujer
        userSave.sexoPreferencia = params.sexo == 1 ? 0 :  1;  
        userSave.tipo            = params.tipo;// 1 cliente Normal; 8 modelo
        userSave.fechaNacimiento = params.fechaNacimiento;
        userSave.email           = params.email;
        userSave.created         = moment().unix();
        userSave.estado         = 0;
        userSave.enabled        = true;

        FindEmail(userSave.email).then((value)=>{
            if(value.count == 0 ) {
                
                    bcrypt.hash(params.password, null, null, (err, hash)=> {
                    userSave.password = hash;
                    saveUserMatch(userSave).then((value) => {

                        if (value.status == 1) {
                            return res.status(200).send(
                                {  
                                    token :  jwt.createToken( value.data), 
                                    user: value.data ,
                                    status:1
                                });
                        }else{ 
                            return res.status(200).send({
                                 user: value.data, status: value.status}); }
                   
                    }); 
                });

            }else{
                return res.status(200).send({ message: 'Este correo ya esta registrado', status: 9 });
            }

        });
    }

}

function saveModelo(req, res){
    var params = req.body;
    var userSave = new User();
    if(params.email && params.password){
        userSave.nombres         = params.nombres;
        userSave.sexo            = params.sexo; // 1 Hombre ; 0 Mujer
        userSave.sexoPreferencia = params.sexo == 1 ? 0 :  1;  
        userSave.tipo            = params.tipo;// 1 cliente Normal; 8 modelo
        userSave.fechaNacimiento = params.fechaNacimiento;
        userSave.email           = params.email;
        userSave.created         = moment().unix();
        userSave.estado         = 0;
        userSave.enabled        = true;
        userSave.idCity         = params.city;
        userSave.idCountry      = params.country;

        FindEmail(userSave.email).then((value)=>{
            if(value.count == 0 ) {
                
                    bcrypt.hash(params.password, null, null, (err, hash)=> {
                    userSave.password = hash;
                    saveUserMatch(userSave).then((value) => {

                        if (value.status == 1) {
                            return res.status(200).send(
                                {  
                                    
                                    token :  jwt.createToken( value.data), 
                                    user: value.data ,
                                    status:1
                                });
                        }else{ 
                            return res.status(200).send({
                                 user: value.data, status: value.status}); }
                   
                    }); 
                });

            }else{
                return res.status(200).send({ message: 'Este correo ya esta registrado', status: 9 });
            }

        });
    }

}


async function FindEmail(email) {
       
    var query = {'email':email};
    var data ;
    var findEntity = await User.findOne(query)
    .exec()
    .then((resultEntity) => { 
        if(resultEntity){
            data = {
                data:resultEntity,
                count:1
            }
        }else{
            data = {
                data:resultEntity,
                count:0
            } 
        }
        return Promise.resolve(data);
    })
    .catch((err) => { return handleError(err);    });
    return Promise.resolve(findEntity);
    }

async function saveUserMatch(UserS) {
        let saveUser =await UserS
        .save()
        .then(savedObj => {
          
            if (savedObj) { 
                savedObj.someProperty = null;
                var data ={
                    data : savedObj,
                    status:1
                };
                return Promise.resolve(data);
            } else {    var data ={
                        data : error,
                        status:0
            }
            return Promise.reject(data);
            }
    });
    return Promise.resolve(saveUser);
}

async function LoginAfterRegister(User){
    var email = User.email;
    console.log()
    // var password = params.password;
    var query = {'email':email};
    var data ;
    var findEntity = await User.findOne(query)
    .exec()
    .then((resultEntity) => { 
        if(resultEntity){
            data = {
                token :  jwt.createToken(user),
                user:user,
                data:resultEntity,
                count:1
            }
        }else{
            data = {
                data:resultEntity,
                count:0
            } 
        }
        return Promise.resolve(data);
    })
    .catch((err) => { return handleError(err);    });
    return Promise.resolve(findEntity);
}


function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({email:email}, (err, user)=>{
        if(err) return res.status(500).send({message:'Error en la peticion', status:0});
        if(user){
            bcrypt.compare(password, user.password, (err,check)=>{
                if(check){                
                    if (user.estado == 1) { //Chequear si esta activado el usuario 1 activado; 
                            user.password = undefined;
                            return res.status(200).send({
                                token :  jwt.createToken(user),
                                user:user,
                                status:1,
                                message:'ok'
                            });   
                    }else{return res.status(200).send({message:'El usuario esta desactivado', status:3}) }

                }else{ 
                    return res.status(200).send({message:'El usuario no ha podido con la clave', status:2})
            
                }
            });
            /////////
        }else{
            return res.status(200).send({message:'Este correo no existe', status:8,message:'ok'})
        }
    });
}

function editPreferenciaSexo(req, res){

        var params = req.body;
        if (params.id == null) {
            return res.status(200).send({message:'Falta el id', status:0});
        }
        
        var EditUser = new User();
        EditUser.sexoPreferencia =  params.sexoPreferencia != null ? params.sexoPreferencia :  -1;
        if (EditUser.sexoPreferencia == -1) {  EditUser.sexoPreferencia = req.user.sub == 1 ? 0 :  1;  }

        var condition = {_id:params.id};
        var query     = { $set: { sexoPreferencia: EditUser.sexoPreferencia } };

        User.updateOne(condition, query, (err, userUpdated) =>{
            if(err) return res.status(200).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
            if(!userUpdated) return res.status(200).send({message:'No se ha podido actualizar el usuario', status:0});        
            return res.status(200).send({user:userUpdated, status:1});
        });
    }
        
    // Edicion de datos de usuario
function updateUser(req, res){
      
        var userId= req.params.id;
        var update= req.body;
        // borrar propiedad password
        delete update.password;
        delete update.email;

        if(userId != req.user.sub){  return res.status(300).send({message:'no tienes permiso'})};
        User.findOneAndUpdate({_id:userId}, update,{new:true}, (err, userUpdated) =>{
            if(err) return res.status(505).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
            if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario', status:0});
            return res.status(200).send({user:userUpdated, status:1});
        }); 
    }

    // Edicion de datos de usuario del modelo
    function updateUserModel(req, res){

            var userId= req.params.id;
            var update= req.body;
            // borrar propiedad password
            delete update.password;
            delete update.email;

            let data = {
                nombres:update.nombres, 
                descripcion:update.descripcion
            };
    
            if(userId != req.user.sub){  return res.status(300).send({message:'no tienes permiso'})};
            User.findOneAndUpdate({_id:userId}, data,{new:true}, (err, userUpdated) =>{
                if(err) return res.status(505).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
                if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario', status:0});
                return res.status(200).send({user:userUpdated, status:1});
            }); 
        }

        
    //Quitar el passwrod
    function  getUserModelo(req, res){
        var userId = req.params.id;
  
        User.findById(userId, (err, user)=>{
            if(err) return res.status(500).send({message:'Error en la peticion CU-M8', status:0});
            if(!user) return res.status(404).send({message:'El usuario no existe', status:0});
            
            return res.status(200).send({
                user,
                status:1
            })
        })
    }

    /**Cloudinay  subir  fotos**/
function uploadCloudinary (req, res){

    var userId = req.params.id;
    var file_path = req.files.image.path;
    console.log('file_path: '+file_path);
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    
    console.log('file_name: '+file_name);

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    cloudinary.config({ 
        cloud_name: conf.cloudinary.name ,  
        api_key: conf.cloudinary.key, 
        api_secret: conf.cloudinary.secret,
        uploadOptions: {
            folder: 'modelos'
        }
    });
 
    cloudinary.uploader.upload(file_path,  function(result) { 
            if(result != null){
            
            var format = result.format;
            var namepublic = result.public_id;
            var urlimage = namepublic + "."+format;
            var version = result.version;//.toString();
            urlimage = "v"+version+"/"+urlimage;
            
            User.findByIdAndUpdate(userId,
                {image:urlimage},
                {new: true},
                (err, userUpdated) =>{
                    if(err) return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario'})
                    if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
                    return res.status(200).send({user:userUpdated});        
                })
            }else{
                return res.status(200).send({user:'error',status:0}); 
            }
                
        });

}


function uploadDNI (req, res){

    var userId = req.params.id;
    var file_path = req.files.image.path;
    console.log('file_path: '+file_path);
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    
    console.log('file_name: '+file_name);

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    cloudinary.config({ 
        cloud_name: conf.cloudinary.name ,  
        api_key: conf.cloudinary.key, 
        api_secret: conf.cloudinary.secret,
        uploadOptions: {
            folder: 'modelos'
        }
    });
 
    cloudinary.uploader.upload(file_path,  function(result) { 
            if(result != null){
            
            var format = result.format;
            var namepublic = result.public_id;
            var urlimage = namepublic + "."+format;
            var version = result.version;//.toString();
            urlimage = "v"+version+"/"+urlimage;
            
            User.findByIdAndUpdate(userId,
                {dni:urlimage},
                {new: true},
                (err, userUpdated) =>{
                    if(err) return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario'})
                    if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
                    return res.status(200).send({user:userUpdated});        
                })
            }else{
                return res.status(200).send({user:'error',status:0}); 
            }
            
        });
        
    }
    
    function uploadPayCloudinary (req, res){
        var userId = req.params.id;
        console.log('vlai'+userId)

        //console.log(req.body.nam);
        var file_path = req.file.mimetype;
        var format    = file_path.split('/');
        cloudinary.v2.uploader
            .upload_stream({ format: format[1] ,folder: 'pay'}, (error, result) => { 
            if (result) {
                var format = result.format;
                var namepublic = result.public_id;
                var urlimage = namepublic + "."+format;
                var version = result.version;//.toString();
                urlimage = "v"+version+"/"+urlimage;
                console.log('urlimage'+urlimage);
                User.findByIdAndUpdate({_id:userId},
                    {imagepay:urlimage},
                    {new: true},
                    (err, userUpdated) =>{
                        if(err) return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario',status:0})
                        if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario',status:0});
                        return res.status(200).send({user:userUpdated,status:1});        
                    })
                //return res.status(200).send({status:1}); 
                
            }else{
                console.log(error);
                return res.status(200).send({status:0}); 
            }
    
       }).end(req.file.buffer);

    }


    function uploadPayCloudinary2 (req, res){

        var userId = req.params.id;
        var file_path = req.files.image.path;

        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        

    
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
    
        cloudinary.config({ 
            cloud_name: conf.cloudinary.name ,  
            api_key: conf.cloudinary.key, 
            api_secret: conf.cloudinary.secret,
            uploadOptions: {
                folder: 'pay'
            }
        });
     
        cloudinary.uploader.upload(file_path,  function(result) { 
                if(result != null){
                
                var format = result.format;
                var namepublic = result.public_id;
                var urlimage = namepublic + "."+format;
                var version = result.version;//.toString();
                urlimage = "v"+version+"/"+urlimage;
                
                User.findByIdAndUpdate(userId,
                    {imagepay:urlimage},
                    {new: true},
                    (err, userUpdated) =>{
                        if(err) return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario',status:0})
                        if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario',status:0});
                        return res.status(200).send({user:userUpdated,status:1});        
                    })
                }else{
                    return res.status(200).send({user:'error',status:0}); 
                }
                    
            });
    
        }
    /**Listado usuarios paginado **/
    function getUsersPage(req, res){
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
    /**--Listado usuarios paginado **/

    function updateRedSocial(req, res){
        let red= req.body.red;
        let tipo= req.body.tipo;
        
        let identity_user_id = req.user.sub;
        let condition ={_id:identity_user_id};
        let query;
        // 1 Red Social 
        // 2 Whatsaap
        switch (tipo) {
            case 1:   query     = { redSocial: red } ; break;
            case 2:   query     = { whatsapp:   red } ; break;
            default:  break;
        }
     
        User.updateOne(condition, query, (err, userUpdated) =>{
            if(err) return res.status(505).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
            if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario', status:0});
            return res.status(200).send({user:userUpdated, status:1});
        });

    }

    /****** Admin *****/
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


    /**List Modelo */
    function getModeloPage(req, res){
        var identity_user_id = req.user.sub;
        var page = 1;

        let query = {tipo:8, estado:1 }// 8 son modelos:  7Clientes
        var itemsPerPage = 12;
        if(req.params.page){ 
            page= req.params.page;
            page=page-1; 
            
        };
        /*
        User.find(query).sort('_id').paginate(page, itemsPerPage, (err, users, total)=>{
            if(err) return res.status(500).send({message: 'Error de la peticion', status:0});
            if(!users) return res.status(404).send({message:'No hay usuarios disponibles', status:0});
            return res.status(200).send({
                users,
                total:total ,
                pages: Math.ceil(total/itemsPerPage),
                status:1
            })
        }
        )
        */
        

        User.aggregate(
        [   { $match:query},// numero:1
          
            {$lookup:{
                from: "cities",
                localField: "idCity",
                foreignField: "_id",
                as: "dataCity",
                }},
              {$lookup:{
                from: "countries",
                localField: "idCountry",
                foreignField: "_id",
                as: "dataCountry",
            }},
            
     
            {
                $project:{
                    "city" :"$dataCity.name",
                    "country" :"$dataCountry.name",
                    nombres:1,
                    apellidos:1,
                    sexo:1,
                    twitter:1,
                    redSocial:1,
                    whatsapp:1,
                    image:1,
                    descripcion:1,
                    fechaNacimiento:1

                }
            },
            { '$facet'    : {
                total: [ { $count: "total" }, { $addFields: { pages: itemsPerPage }}],
                //pages: [  Math.ceil( total/itemsPerPage) ],
                users: [  { $skip: itemsPerPage*page },{ $limit: itemsPerPage } ] // add projection here wish you re-shape the docs
             } }
        ],
        function(err, cursor) {
            return res.status(200).send({users:cursor,status:1,message:'ok'});        
            }
        )
        
    }

    function home (req, res)  {
        res.status(200).send({   message:'Accion de pruebas' });
    };
    module.exports = {
        home,
        saveUser,
        saveModelo,
        loginUser,
        editPreferenciaSexo,
        updateUser,
        uploadCloudinary,
        uploadDNI,
        getUserModelo,
        getUsersPage,
        updateUserModel,
        updateRedSocial,

        //admin
        getUsersClientPage,
        changeEstadoUser,
        uploadPayCloudinary,
        //modelo
        getModeloPage
    }