const router = require("express").Router();
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    // 1. If the user already exists
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send({
        message: "User Already exists!",
        success: false,
      });
    }

    // 2. Encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // 3. Create new user and save in DB
    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).send({
      message: "User Created Successfully!",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1. Check if the user exists
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) {
      return res.send({
        message: "User doesn't exist",
        success: false,
      });
    }

    // 2. Check if the password is correct
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.send({
        message: "Wrong email/password",
        success: false,
      });
    }

    // 3. If the user exists and password is correct, assign a JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      message: "User logged in successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    return res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
