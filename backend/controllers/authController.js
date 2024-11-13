import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApplicationError from "../utils/ApplicationError.js";
import generateJWT from "../utils/generateJWT.js";

const signup = asyncHandler(async (req, res, next) => {
  // get the data
  const { name, email, password } = req.body;

  // check if email already registered
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new ApplicationError(409, `User with email ${email} already exist`);
  }

  // create new user
  const createdUser = await User.create({
    name,
    email,
    password,
  });

  if (!createdUser) {
    throw new ApplicationError(500, "Couldn't complete signup");
  }

  const user = createdUser.toObject();
  delete user.password;
  return res.status(201).json({
    message: "User signed up successfully",
    success: true,
    data: user,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email is registered or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApplicationError(404, "Email not found. Please signup");
  }
  // if registered check if password is correct or not
  const passwordMatch = await user.matchPassword(password);
  if (!passwordMatch) {
    throw new ApplicationError(401, "Incorrect password");
  }
  // generate jwt token if everything is correct
  const token = generateJWT({
    email: user.email,
    _id: user._id,
  });

  // send response to the user and send token in cookies as well
  const loggedInUser = user.toObject();
  delete loggedInUser.password;

  const cookieOptions = {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
    // maxAge: 24 * 60 * 60 * 1000, // 24 hours in miliseconds
  };

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({
      message: "User logged in successfully",
      success: true,
      data: {
        user: loggedInUser,
        token: token,
      },
    });
});

export { signup, login };
