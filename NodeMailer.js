const nodemailer=require('nodemailer');

// Initialize Nodemailer trasporter
const transportor  = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"ancloudskill@gmail.com",
        pass:""
    }
});

module.exports={transportor};