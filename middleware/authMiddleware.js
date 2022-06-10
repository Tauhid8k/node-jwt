const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check jwt is exist & valid
  if (token) {
    jwt.verify(token, "tauhidthecoder8k", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  // check jwt is exist & valid
  if (token) {
    jwt.verify(token, "tauhidthecoder8k", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const checkRoutes = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    res.redirect("/items");
  } else {
    next();
  }
};

module.exports = { requireAuth, checkUser, checkRoutes };
