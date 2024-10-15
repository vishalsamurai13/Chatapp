const router = require("express").Router();
const authMiddleware = require("./../middlewares/authMiddleware");
const Chat = require("./../models/chat");
const Message = require("./../models/message");

router.post("/new-message", authMiddleware, async (req, res) => {
  try {
    //store the message in msg collection
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    //update the last message in chat collection
    const currentChat = await Chat.findOneAndUpdate(
      {
        _id: req.body.chatId,
      },
      {
        lastMessage: savedMessage._id,
        $inc: { unreadMessageCount: 1 },
      }
    );

    res.status(201).send({
      message: "Message Sent Successfully",
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-message/:chatId", authMiddleware, async (req, res) => {
  try {
    const allMessages = await Message.find({chatId: req.params.chatId})
                                    .sort({createdAt: 1});
    res.send({
        message: "Message Fetched Successfully",
        success: true,
        data: allMessages
    })

  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
