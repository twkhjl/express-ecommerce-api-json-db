const jsonwebtoken = require("jsonwebtoken");

const secrets = {
  cp: process.env.SECRET_CP,
  front: process.env.SECRET_FRONT,
};

const token_type = ["cp", "front"];

const TokenHelper = {

  verifyToken(token, type) {
    let decoded = "";
    if (!type) {
      return { error: "jwt type blank" };
    }
    if (token_type.indexOf(type) == -1) {
      return { error: "invlaid jwt type" };
    }
    if (!token) {
      return { error: "jwt blank" };
    }
    try {
      decoded = jsonwebtoken.verify(token, secrets[type]);
    } catch (error) {
      return { error: "invalid jwt token" };
    }
    return {
      success: decoded,
    };
  },
  signToken(data, type, time = process.env.EXPIRES_IN) {
    return jwt.sign(data, secrets[type], { expiresIn: time });
  }
  
};

module.exports = TokenHelper;
