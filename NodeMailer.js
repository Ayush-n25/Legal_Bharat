const nodemailer=require('nodemailer');

// Initialize Nodemailer trasporter
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: '',
        pass: ''
    }
});

module.exports={transporter};