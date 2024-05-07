const nodemailer=require('nodemailer');

// Initialize Nodemailer trasporter
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'demetrius.king@ethereal.email',
        pass: '2q8FAZURnu2pnBhMCC'
    }
});

module.exports={transporter};