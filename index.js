var PORT = process.env.PORT || 5000;
const http = require('http')
const express = require('express');
const nodemailer = require('nodemailer');
const StringDecoder = require('string_decoder').StringDecoder;
require('dotenv').config();

const app = express();
const server = http.Server(app);


app.use(express.static('client'));

app.get('/test', (req, res) => {
})

app.post('/send', (req, res) => {

    var decoder = new StringDecoder('utf-8');

    var buffer = '';

    req.on('data', function (data) {
        buffer += decoder.write(data);
    })

    req.on('end', function () {
        buffer += decoder.end();

        var parsedBuffer = JSON.parse(buffer);

        const { fullName, email, subject, message } = parsedBuffer
        let output = `
                <p>${message}</p>
            `;

        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: `${fullName} <${email}>`,
            to: `${email}, phitgeek@gmail.com`,
            subject: `${subject}`,
            text: "What is this used for?",
            html: output
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return console.log('Error occurs', err);
            }
            return console.log('Email sent!!!', data);
        });
    })
})


server.listen(PORT, () => console.log('Server started'))