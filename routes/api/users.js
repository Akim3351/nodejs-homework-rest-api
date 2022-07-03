const express = require("express");
const usersRouter = express.Router();
const {
    authenticate,
    validation,
    ctrlWrapper
} = require("../../middlewares");
const { authSchema } = require("../../schemas");

const {
    getCurrentUser,
    updateSubscription,
    signIn,
} = require("../../controllers/users");
const {
    signUp,
    signOut,
} = require("../../controllers/auth");

usersRouter.post("/signup", validation(authSchema), ctrlWrapper(signUp));
 
usersRouter.post("/login", validation(authSchema), ctrlWrapper(signIn));

usersRouter.post("/logout", authenticate, ctrlWrapper(signOut));

usersRouter.get("/current", authenticate, ctrlWrapper(getCurrentUser));

usersRouter.post("/users/:userId", authenticate, ctrlWrapper(updateSubscription));

module.exports = usersRouter;