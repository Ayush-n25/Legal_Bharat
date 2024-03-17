const nodemailer=require('nodemailer');

// Initialize Nodemailer trasporter
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'gilda74@ethereal.email',
        pass: 'ZdH4yc56n9wNnD7h4X'
    }
});

module.exports={transporter};