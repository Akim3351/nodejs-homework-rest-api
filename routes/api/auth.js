const express = require("express");
const authRouter = express.Router();

const {
    signUp,
    signIn
} = require("../../controllers/auth")

authRouter.post("/register", signUp);

authRouter.post("/login", signIn);

module.exports = authRouter;