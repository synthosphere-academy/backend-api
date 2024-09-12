var nodemailer = require('nodemailer');


var sendMail = async function (str, data, token) {
    // --------------------------- connection with SMTP server
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'happyankit78588@gmail.com',
            pass: 'tpeo eqmv cesc tkfg'
        }
    });


    // --------------------------- create email details
    let recipientEmail = data.email;
    let subject, html;
    if (str == 'forgotPassword') {
        subject = `Thank you for visiting ${data.fullname}`;
        html = `<h1>Welcome to Synthosphere Academy.</h1>  
                <p> Reset password by clicking here: 
                <a href="https://synthosphereacademy.in/verify-email?token=${token}">Click here</a> </p>`
    }

    // --------------------------- mailOptions
    var mailOptions = {
        from: 'happyankit78588@gmail.com',
        to: recipientEmail,
        subject: subject,
        html: html
    };

    // --------------------------- send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return 'sent';
    } catch (error) {
        console.log(error);
        return 'error';
    }
}


module.exports = sendMail;


