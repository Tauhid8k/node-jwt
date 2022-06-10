const express = require("express");
const router = express.Router();
const {
  signupGet,
  signupPost,
  loginGet,
  loginPost,
} = require("../controllers/authController");

router.get("/signup", signupGet);
router.post("/signup", signupPost);
router.get("/login", loginGet);
router.post("/login", loginPost);

module.exports = router;
