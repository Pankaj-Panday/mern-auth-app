import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // when you set unique = true, it automatically creates a unique index, and hence don't need to use index: true
  },
  password: {
    type: String,
    required: true,
  },
});

// add an instance method to match password with hashed password
userSchema.methods.matchPassword = async function (plaintextPwd) {
  const user = this;
  return await bcrypt.compare(plaintextPwd, user.password);
};

// write method to hash the password
userSchema.pre("save", async function () {
  // 'save' is a document middleware and this refer to the document itself
  const user = this;
  // do nothing if the password is same as before
  if (!user.isModified("password")) return;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  user.password = hashedPassword;
});

const User = new mongoose.model("User", userSchema);
export default User;
