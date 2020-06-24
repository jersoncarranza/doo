'use strict';
var mongoose =  require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var UserSchema = Schema ({
  
    nombres:    String,
    apellidos:  String,
    nickname:   String,
    password:   String,
    estadoCivil:String,
    fechaNacimiento: String,
    image:      String,
    imagepay: String,
    email:      String,
    codigo:     String,
    estado:     Number, //0 Inabilitado ; 1 Habilitado
    enabled:    Boolean, // True: Activo: False Desactivado
    sexo:       Number,
    tipo:       Number, // 7 cliente, 8 modelo
    sexoPreferencia:Number, //  0 Mujer(Woman); 1 Hombre (Man Male)
    independiente: Number,
    tatto:        Number,
    hijos:        Number,
    descripcion:  String,
    facebook:     String,
    twitter:      String,
    created:      String,
    redSocial:    String,
    whatsapp:     String,
    dni:          String  ,
    idCity:        {type: Schema.ObjectId, ref:'city'},
    idCountry:      {type: Schema.ObjectId, ref:'country'},

    
});
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);

