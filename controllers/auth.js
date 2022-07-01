const { Conflict,
    Unauthorized,
    BadRequest
} = require("http-errors");
const { authSchema } = require("../schemas");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const signUp = async (req, res) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        throw new BadRequest();
    }
    const {name, email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw new Conflict("Email in use");
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await User.create({name, email, password: hashPassword});
    res.status(201).json({
        status: "success",
        code: 201,
        data: {user: {
            email: result.email,
            name: result.name,
        }}
    })};

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

module.exports = {
    signIn,
    signUp
};