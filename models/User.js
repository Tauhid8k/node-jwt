const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    minlength: [8, "Minimum password length is 8 characters"],
  },
});

// before users doc saved to db encrypt password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrent password");
  }
  throw Error("incorrent email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
