const passport = require("passport");
let passportJwt = require("passport-jwt");

let LocalStratergy = require("passport-local").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
let JWTStratergy = passportJwt.Strategy;
let ExtractJWT = passportJwt.ExtractJwt;

const mongoose = require("mongoose");

const jwtConfig = require("../config/jwt.config");

const constants = require("../config/constants");

const jwtUtil = require("../lib/utils/jwt.utils");

const bcrypt = require("bcrypt");

const User = require("../models/User");

passport.use(
  new LocalStratergy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // Login Stratergy here!
      try {
        let user = await User.findOne({
          email: email,
        });
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            let userJson = user.toJSON();
            const tokens = generateTokens(userJson);
            return done(null, {
              user: userJson,
              ...tokens,
            });
          } else {
            throw new Error(constants.error.auth.invalidCredentials);
          }
        }
        throw new Error(constants.error.auth.invalidCredentials);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new JWTStratergy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secretKey,
    },
    async (jwtPayload, done) => {
      try {
        // Validate the type of the token if applicable
        if (jwtPayload.type !== jwtUtil.TokenType.ID_TOKEN) {
          return done(new Error(constants.error.auth.invalidToken), null);
        }

        // Ensure the ID is valid
        if (
          !jwtPayload._id ||
          !mongoose.Types.ObjectId.isValid(jwtPayload._id)
        ) {
          return done(new Error("Invalid User ID"), null);
        }

        // Find the user by ID
        const user = await User.findById(jwtPayload._id);
        if (user) {
          return done(null, user.toJSON());
        } else {
          return done(new Error(constants.error.auth.invalidUser), null);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  "verifyRefreshToken",
  new CustomStrategy(async function (req, done) {
    if (req.headers["x-refreshtoken"]) {
      const refreshToken = req.headers["x-refreshtoken"].toString();
      try {
        const decodedPayload = jwtUtil.verifyToken(refreshToken);
        console.log(decodedPayload);
        if (decodedPayload.type !== jwtUtil.TokenType.REFRESH_TOKEN) {
          throw new Error("Invalid token");
        }
        const user = await User.where({
          id: decodedPayload.id,
          email: decodedPayload.email,
        }).fetch({ require: false });
        let userJSON = user.toJSON();
        const tokens = generateTokens(userJSON);
        return done(null, { user, ...tokens });
      } catch (error) {
        return done(error, null);
      }
    }
    done("refresh token missing", null);
  })
);

function generateTokens(payload) {
  const token = jwtUtil.generate({
    ...payload,
    type: jwtUtil.TokenType.ID_TOKEN,
  });

  const refresh_token = jwtUtil.generateRefreshToken({
    ...payload,
    type: jwtUtil.TokenType.REFRESH_TOKEN,
  });
  return {
    token,
    refresh_token,
  };
}

module.exports.generateSignUpToken = function (userJson) {
  const tokens = generateTokens(userJson);
  return {
    user: userJson,
    ...tokens,
  };
};
module.exports.authenticateJWT = (req, res, next) => {
  // Use Passport to authenticate with the 'jwt' strategy
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      // Pass any errors to the next middleware or error handler
      return next(err);
    }

    if (!user) {
      // If no user is found, respond with 401 Unauthorized
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach the authenticated user to the request object
    req.user = user;
    next();
  })(req, res, next);
};

module.exports.optionalJwtAuth = (req, res, next) =>
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    (err, user, info) => {
      if (err && err.name && err.name === "TokenExpiredError") {
        if (err || info) return res.serverError(401, ErrorHandler(err));
      }
      if (info && info.name && info.name === "TokenExpiredError") {
        if (err || info) return res.serverError(401, ErrorHandler(info));
      }
      if (err && err.toString().startsWith("Error: No auth token")) {
        return next();
      }
      if (info && info.toString().startsWith("Error: No auth token")) {
        return next();
      }
      if (err || info) return res.serverError(401, ErrorHandler(err || info));
      req.user = user;
      return next();
    }
  )(req, res, next);
