var nodemailer = require('nodemailer');

async function sendEmailForVerification(signedUpUser){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          // user: 'youremail@gmail.com',
          // pass: 'yourpassword'
          user: 'renudurga32@gmail.com',
          pass: ''
        }
      });
      let link=`http://localhost:3000/user/emailVerification/${signedUpUser.uniqueCode}`;

      var mailOptions = {
        from: 'renudurga32@gmail.com',
        to: signedUpUser.email,
        subject: 'Marmeto signup email verification',
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"

      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return info.response;
        }
      });
    // console.log("email sent");
    // return true;
}

module.exports ={ sendEmailForVerification}
