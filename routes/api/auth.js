const express = require("express");
const authRouter = express.Router();

const {
  ctrlWrapper,
  validation,
  authenticate,
} = require("../../middlewares");

const { authSchema } = require("../../schemas");

const {
    signIn,
    signOut
} = require("../../controllers/auth");

authRouter.post("/login", validation(authSchema), ctrlWrapper(signIn));

authRouter.post("/logout", authenticate, ctrlWrapper(signOut));


module.exports = authRouter;