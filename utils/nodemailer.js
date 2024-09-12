var nodemailer = require('nodemailer');

var sendMail = async function (str, data, token) {
    console.log('2. Inside sendMail function');
    

    // --------------------------- connection with SMTP server
    var transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',            // Replace with your actual SMTP host
        port: 465,                                      // Use 587 for TLS or 465 for SSL (verify with your provider)
        secure: true,                                  // Set to `true` for port 465 (SSL), otherwise `false` for TLS on port 587
        auth: {
            user: 'support@synthosphereacademy.in',     // Your custom email
            pass: 'Sa@@@@2024'                 // Your email password (or app-specific password)
        }
    });

    console.log('3. Inside sendMail function');
    
    // --------------------------- create email details
    console.log('4. Inside sendmail fxn');
    let recipientEmail = data.email;
    let subject, html;

    
   
    
    
    if (str == 'forgotPassword') {
        subject = `Thank you for visiting ${data.fullname}`;
        html = `<h1>Welcome to Synthosphere Academy.</h1>  
                <p> Reset password by clicking here: 
                <a href="https://synthosphereacademy.in/verify-email?token=${token}">Click here</a> </p>`
    }
    
    console.log(str);
    console.log("5. ");
    console.log(recipientEmail); 
    console.log("6. ");
    console.log(subject);
    console.log("7. ");
    console.log(html);
    

    // --------------------------- mailOptions
    var mailOptions = {
        from: 'support@synthosphereacademy.in',
        to: recipientEmail,
        subject: subject,
        html: html
    };

    console.log('8.');
    console.log(mailOptions);
    

    // --------------------------- send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return 'sent';
    } catch (error) {
        console.log(error);
        console.log(error.message);
        
        return 'error';
    }
}


module.exports = sendMail;


