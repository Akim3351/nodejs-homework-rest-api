const { Conflict } = require("http-errors");
const { User } = require("../models/user");
const { sendEmail } = require("../helpers/sendEmail");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
require("dotenv").config();


const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({email});
    if(user){
        throw new Conflict("Email in use");
    }

    const verificationToken = v4();
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await User.create({name, email, password: hashPassword, subscription: "starter", avatarURL: gravatar.url(email), verificationToken
});

    const mail = {
        to: email,
        subject: "Подтверждения email",
        html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Подтвердить email</a>`
    };

    await sendEmail(mail);
    
res.status(201).json({
        status: "success",
        code: 201,
        data: {user: {
            email: result.email,
            subscription: result.subscription,
            avatar: result.avatarURL,
            verificationToken,
        }}
    })};


const signOut = async (req, res)  => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({ message: "No Content" });
};




module.exports = {
    signUp,
    signOut
};