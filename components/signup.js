const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptConfig = require("../config/bcrypt.config");
const passportMiddleWare = require("../middlewares/passport.middleware");

module.exports = async (req, res) => {
  try {
    let body = req.body;

    // Create a new user
    const user = {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: await bcrypt.hash(body.password, bcryptConfig.hashRound),
    };

    let exist_user = await User.findOne({ email: user.email });

    if (exist_user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const new_user = await User.create(user);

    //Generate access tokens
    const data = passportMiddleWare.generateSignUpToken(new_user.toJSON());

    delete data.user.password;

    return res.status(200).json(data);
  } catch (error) {
    // Use the custom property
    return res.send(error);
  }
};
