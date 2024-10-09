const express = require("express");
const signUp = require("../components/signup");
const signIn = require("../components/signIn");
const { userSchema, loginSchema } = require("../middlewares/common.validation");
const validator = require("express-joi-validation").createValidator({});

const userRouter = express.Router();

userRouter.post("/sign-up", validator.body(userSchema), signUp);
userRouter.post("/sign-in", validator.body(loginSchema), signIn);

module.exports = userRouter;
