import jwt from "jsonwebtoken";

const generateJWT = function (payload) {
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "10d",
  };
  return jwt.sign(payload, secret, options);
};

export default generateJWT;
