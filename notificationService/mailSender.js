const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com', // server para enviar mail desde gmail
port: 587,
secure: false, // true for 465, false for other ports
auth: {
user: '<suCuentaDeGmail>',
pass: '<suPasswordEnTextoPlano>',
},
});
// setup email data with unicode symbols
const mailOptions = {
    from: '"Subscription Service" <subsctiptionService@example.com>', // sender address
    to: 'mail1@gmail.com, mail2@hotmail.com', // list of receivers
    subject: 'Asunto', // Subject line
    text: 'asdadadas', // plain text body
    html: '<b>Hello world?</b>' // html body
};

// enviando mail con callbacks
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
console.log(error);
} else {

6

console.log(info);
});
// enviando mail con promesas
transporter.sendMail(mailOptions).then( ...)