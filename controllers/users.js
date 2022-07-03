const {
    Unauthorized,
    BadRequest
} = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authSchema } = require("../schemas");
const { SECRET_KEY } = process.env;
const { User } = require("../models/user");

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

module.exports = {
    getCurrentUser,
    signIn,
    updateSubscription
};