const http = require("http");
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const StringDecoder = require("string_decoder").StringDecoder;
require("dotenv").config();

const isDevEnv = process.env.NODE_ENV !== "production";
const { PORT = 5000 } = process.env;

const app = express();
const server = http.Server(app);

isDevEnv && app.use(cors({ origin: true }));

app.use(express.static("client"));

app.get("/test", (req, res) => {
    res.send({ messge: "Active" });
});

app.post("/send", (req, res) => {
    var decoder = new StringDecoder("utf-8");

    var buffer = "";

    req.on("data", function (data) {
        buffer += decoder.write(data);
    });

    req.on("end", async function () {
        buffer += decoder.end();

        var parsedBuffer = JSON.parse(buffer);

        const { fullName, email, subject, message } = parsedBuffer;

        let output = `
                <p>${message}</p>
            `;

        let transporter = nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.PASSWORD,
            },
        });

        let mailOptions = {
            from: `davidobodo@rocketmail.com`,
            to: "obododavid5@gmail.com",
            subject: `${subject}`,
            text: "What is this used for?",
            html: output,
        };

        try {
            const result = await transporter.sendMail({ ...mailOptions });

            console.log(result);
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    });
});

server.listen(PORT, () => console.log("Server started"));
