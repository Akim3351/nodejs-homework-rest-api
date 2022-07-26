const express = require("express");
const usersRouter = express.Router();
const {
    authenticate,
    validation,
    ctrlWrapper,
    upload
} = require("../../middlewares");
const { authSchema } = require("../../schemas");

const {
    getCurrentUser,
    updateSubscription,
    signIn,
    updateAvatar,
    verify,
    resendEmail
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

usersRouter.patch("/users/avatars", authenticate, upload.single("avatar"), ctrlWrapper(updateAvatar));

usersRouter.get("verify/:verificationToken", authenticate, ctrlWrapper(resendEmail));

usersRouter.post("verify", authenticate, ctrlWrapper(verify));

module.exports = usersRouter;