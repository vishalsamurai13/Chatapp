const router = require("express").Router();
const User = require("./../models/user");
const authMiddleware = require("./../middlewares/authMiddleware");

//Get details of current logged in user

router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    res.send({
      message: "user fetched successfully!",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
    try {
      const allUsers = await User.find({ _id: {$ne : req.body.userId} });
  
      res.send({
        message: "user fetched successfully!",
        success: true,
        data: allUsers,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
        success: false,
      });
    }
  });

module.exports = router;
