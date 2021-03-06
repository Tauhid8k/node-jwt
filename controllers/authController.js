const User = require("../models/User");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { name: "", email: "", password: "" };

  // email check (login)
  if (err.message === "incorrect email") {
    errors.email = "Email is not registered";
  }

  // password check (login)
  if (err.message === "incorrect password") {
    errors.password = "Password is incorrect";
  }

  // duplicate user email error
  if (err.code === 11000) {
    errors.email = "This email is already been taken";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// JWT
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "tauhidthecoder8k", { expiresIn: maxAge });
};

// @desc    Signup Page
// @route   GET /signup
// @access  Public
const signupGet = (req, res) => {
  res.render("auth/signup");
};

// @desc    Signup Post
// @route   POST /signup
// @access  Public
const signupPost = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// @desc    Login Page
// @route   GET /login
// @access  Public
const loginGet = (req, res) => {
  res.render("auth/login");
};

// @desc    Login Post
// @route   POST /login
// @access  Public
const loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// @desc    Logout User
// @route   GET /logout
// @access  Private
const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = { signupGet, signupPost, loginGet, loginPost, logout };
