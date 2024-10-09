const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");

function generate(user) {
  return jwt.sign(user, jwtConfig.secretKey, {
    expiresIn: jwtConfig.expiresIn,
  });
}

function decodeSubscriptionToken(token) {
  return jwt.decode(token);
}

function decodeAppleIdToken(token) {
  return jwt.decode(token);
}

function generateRefreshToken(user) {
  return jwt.sign(user, jwtConfig.secretKey, {
    expiresIn: "7d",
  });
}

function verifyToken(jwtToken) {
  return jwt.verify(jwtToken, jwtConfig.secretKey, {
    audience: jwtConfig.audience,
    issuer: jwtConfig.issuer,
    maxAge: "7d",
  });
}

function impersonatedUserToken(payload) {
  return jwt.sign(payload, jwtConfig.secretKey, {
    expiresIn: "15m",
    audience: jwtConfig.audience,
    issuer: jwtConfig.issuer,
  });
}
const TokenType = {
  ID_TOKEN: "idToken",
  REFRESH_TOKEN: "refreshToken",
};
module.exports = {
  generate,
  generateRefreshToken,
  verifyToken,
  TokenType,
  impersonatedUserToken,
  decodeSubscriptionToken,
  decodeAppleIdToken,
};
