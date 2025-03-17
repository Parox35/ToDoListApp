const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            //service: process.env.SERVICE,
            port: 587,  // Port for TLS (startTLS)
            secure: false,   // Use `true` for port 465 (SSL); `false` for port 587
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        console.log("Host :" + process.env.HOST);

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: body,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;