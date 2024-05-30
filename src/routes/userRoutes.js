// src/routes/userRoutes.js
const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userController.register
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  userController.login
);

router.get("/profile", auth, userController.getProfile);

module.exports = router;
