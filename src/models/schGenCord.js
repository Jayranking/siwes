const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schGenCordSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  phone_no: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  is_hidden: {
    type: Boolean,
    default: false,
  },
});

schGenCordSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// schGenCord login
schGenCordSchema.statics.login = async function (email, password) {
  const schGenCord = await this.findOne({ email });
  if (schGenCord) {
    // compare password
    const auth = await bcrypt.compare(password, schGenCord.password);

    if (auth) {
      return schGenCord;
    }
    throw new Error("Incorrect email address or password");
  }
  throw new Error("Incorrect email address or password");
};

const SchGenCord = mongoose.model("schGenCord", schGenCordSchema);
module.exports = SchGenCord;
