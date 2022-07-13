const nodemailer = require("nodemailer");
require("dotenv").config();

const {META_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465, 
    secure: true,
    auth: {
        user: "akim_grakovskiy@meta.ua",
        pass: META_PASSWORD
    }
};
const sendEmail = async (verifyToken, email) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);

    const email = {
        to: email,
        from: "akim_grakovskiy@meta.ua",
        subject: "Your acc needs to be verified",
        html: `<a href="http://localhost:3000/api/users/verify/${verifyToken}"> Please, verify your account</a>`
    };
    
    await transporter.sendMail(email)
        .then(()=> console.log("Email send success"))
        .catch(error => console.log(error.message));
    }
module.exports = {
    sendEmail
}


