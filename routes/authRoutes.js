const express = require("express");
const router = express.Router();
const {
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logout,
} = require("../controllers/authController");
const { checkRoutes } = require("../middleware/authMiddleware");

router.get("/signup", checkRoutes, signupGet);
router.post("/signup", signupPost);
router.get("/login", checkRoutes, loginGet);
router.post("/login", loginPost);
router.get("/logout", logout);

module.exports = router;
