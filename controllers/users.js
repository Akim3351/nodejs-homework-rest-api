const {
    Unauthorized,
    BadRequest,
    NotFound
} = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const { authSchema } = require("../schemas");
const { SECRET_KEY } = process.env;
const { User } = require("../models/user");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
const { sendEmail } = require("../../helpers");


const getCurrentUser = async (req, res) => {
    const {name, email} = req.user;
    res.json({
        status: "success",
        code: 200,
        data: {
            user: {
                name,
                email
            }

        }
    })
}

const signIn = async (req, res) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
      throw new BadRequest();
    }

    const { email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = await User.findOne({ email });
    const passwordCompare = bcrypt.compareSync(password, hashPassword);
    if (!user || !passwordCompare) {
        throw new Unauthorized("Email or password is wrong");
    }

    const payload = {
        _id: user.id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h"});

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        status: "success",
        code: 200,
        data: {
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
        }}
    })
};

const updateSubscription = async (req, res) => {
    const { _id, subscription } = req.body;
    const user = await User.findOne({ _id });

        if (!user ) {
        throw new Unauthorized("User doesn`t exist");
    }

    await User.findByIdAndUpdate(user._id, { subscription });

       res.json({
        status: "success",
        code: 200,
        data: {
            user: {
                email: user.email,
                subscription: user.subscription,
        }}
    })
 

};


const updateAvatar = async(req, res)=> {
    const {path: tempUpload, originalname} = req.file;
    const {_id: id} = req.user;
    const imageName =  `${id}_${originalname}`;
    try {
        const resultUpload = path.join(avatarsDir, imageName);
        await fs.rename(tempUpload, resultUpload);
        const avatarURL = path.join("public", "avatars", imageName);
        await User.findByIdAndUpdate(req.user._id, {avatarURL});
        res.json({avatarURL});
    } catch (error) {
        await fs.unlink(tempUpload);
        throw error;
    }
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw new NotFound("User not found");
    }

    await User.findByIdAndUpdate(user._id, {
        verificationToken: null,
        verify: true,
    });
    res.json({
        status: "success",
        message: "Verification successful",
        code: 200,
        data: {
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        }
    })
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequest("missing required field email");
  }
  const user = await User.findOne({ email });
  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }

  const userEmailcontent = {
    to: email,
    subject: "Email verifying",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Confirm your email</a>`,
  };
  await sendEmail(userEmailcontent);
    res.json({
        status: "success",
        message: "Verification email sent",
        code: 200,
        data: {
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        }
    })
};


module.exports = {
    getCurrentUser,
    signIn,
    updateSubscription,
    updateAvatar,
    verify,
    resendEmail
};