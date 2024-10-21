const nodemailer = require('nodemailer');


const sendEmail = (receipientEmail, subject, content) => {

    // Create a transporter using SMTP or other transport methods
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAILFROM,
        pass: process.env.EMAIL_KEY,
    },
    });

    const mailBody = `
    <html>
    <style>
        body {
            background-color: white;
            font-family: Arial, sans-serif;
        }
        a {
            color: #007BFF; /* Blue color for anchor tags */
            text-decoration: none;
        }
        .logo {
            max-width: 100px; /* Set the max-width of your logo */
        }
    </style>

        <body>
            
            <p>${content}</p>
        </body>
    </html>
`;
    // Email options
    const mailOptions = {
    from: process.env.EMAILFROM,
    to: receipientEmail,
    subject: subject,
    html: mailBody,
    };



    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
    });

}



function generatePassword(length) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const symbolChars = '!@#$%^&*()-=_+[]{}|;:,.<>?';
  
    const allChars = uppercaseChars + lowercaseChars + digitChars + symbolChars;
  
    let password = '';
  
    // Ensure at least one character from each character set
    password += getRandomChar(uppercaseChars);
    password += getRandomChar(lowercaseChars);
    password += getRandomChar(digitChars);
    password += getRandomChar(symbolChars);
  
    // Fill the rest of the password with random characters
    for (let i = password.length; i < length; i++) {
      password += getRandomChar(allChars);
    }
  
    // Shuffle the password characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');
  
    return password;
  }
  
  function getRandomChar(characterSet) {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    return characterSet.charAt(randomIndex);
  }
  
  

module.exports = {sendEmail, generatePassword};