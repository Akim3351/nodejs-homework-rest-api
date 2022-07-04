const { Conflict } = require("http-errors");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
require("dotenv").config();

const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({email});
    if(user){
        throw new Conflict("Email in use");
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await User.create({name, email, password: hashPassword, subscription: "starter", avatarURL: gravatar.url(email),
});
    res.status(201).json({
        status: "success",
        code: 201,
        data: {user: {
            email: result.email,
            subscription: result.subscription,
            avatar: result.avatarURL,
        }}
    })};


const signOut = async (req, res)  => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({ message: "No Content" });
};

const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { sendSuccessRes } = require("../../helpers");

const { User } = require("../../models");
const avatarDir = path.join(__dirname, "../../public/avatars");

// const updateAvatar = async (req, res) => {
//   const { path: tempPath, originalname } = req.file;
//   const { _id } = req.user;
//   const [extention] = originalname.split(".").reverse();
//   const newAvatarName = `avatar_${_id.toString()}.${extention}`;
//   const uploadPath = path.join(avatarDir, newAvatarName);
//   const file = await Jimp.read(tempPath);
//   await file.resize(250, 250).write(tempPath);
//   await fs.rename(tempPath, uploadPath);
//   const avatarURL = `/avatars/${newAvatarName}`;
//   await User.findByIdAndUpdate(_id, { avatarURL });
// };


module.exports = {
    signUp,
    signOut,
    // updateAvatar
};