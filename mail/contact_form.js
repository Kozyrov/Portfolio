const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

//possible incoming routes
router.post('/contact_form.js', sendConfirmationEmail);

function sendConfirmationEmail(req, res){
    console.log(req);
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         service: "email",
//         port: 00,
//         secure: false,
//         auth: {
//             user: "email",
//             pass: "password"
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });

// // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"user" <email>', // sender address
//         to: req.body.email, // list of receivers
//         subject: 'Hello ✔', // Subject line
//         html: `<p>this is a test</p>` // html body
//     };

// // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: ', info.messageId, info.response);
//         res.status(200).send(info.response);
//     });
}

module.exports = router;