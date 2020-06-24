'use strict';
var nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = nodemailer.createTransport( {
    service: 'gmail',
    port: 465, 
    secure: true, 
    auth: {
        user: process.env.EMAIL ,
        pass: process.env.PASSWORD, 
        //user: "jersoncarranza2@gmail.com" ,
        //pass: "Ke0985527750" 
    }
});

let mailOptions = {
    from: 'Remitente<jersoncarranza2@gmail.com>',
    to: 'test@mailinator.com',
    subject: 'Asunto Prueba  ejbcuejbcksabcueabiucbe',
    text: 'Contenido del email nuevo'
};


function sendEmail (req, res){

   // res.status(200).send({message:"Se envio el correo", status:1});
    var params = req.body;
    let mailOptions2 ={
        from:params.from,
        to:params.to,
        subject:params.subject,
        text:params.text
    }
    console.log(mailOptions2);
    transporter.sendMail(mailOptions2, function(error, info){
        if (error){
            console.log(error);
            res.status(500).send({message:error, status:2});
        } else {
            console.log("Email sent");
            res.status(200).send({message:"Se envio el correo", status:1});
        }
    });
}
module.exports = {
    sendEmail
}