import User from "../models/userModel.js";
import ApplicationError from "../utils/ApplicationError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyToken = asyncHandler(async (req, res, next) => {
  // Bearer token look like this: Bearer <Your token>
  /**
   * there are actually two ways to get header in request, first is as shown
   * second is using req.headers.<header-name> or req.headers['<header-name>']
   * the second way is not written in express docs but it is a feature of node js
   */

  const token =
    req.cookies?.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new ApplicationError(401, "Unauthorized request, token is required");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    const user = await User.findById(userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    throw new ApplicationError(401, "Invalid or expired token");
  }
});

export default verifyToken;
