const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  faculty: {
    type: String,
    required: true,
  },

  dept: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone_no: {
    type: String,
    required: true,
  },

  schReg_no: {
    type: String,
    required: true,
    unique: true
  },

  gender: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["lecturer", "student"],
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Login
userSchema.statics.login = async function (schReg_no, password) {
  const user = await this.findOne({ schReg_no });
  if (user) {
    // compare password
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("Incorrect Password");
  }
  throw new Error("Incorrect Credentials");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
