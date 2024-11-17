import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import moment from "moment";
import { clearUnreadMessageCount } from "./../../../apiCalls/chat";
import store from "./../../../redux/store";
import socket from "../../../socket";
import { setAllChats } from "../../../redux/usersSlice";
import EmojiPicker from "emoji-picker-react";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sendMessage = async (image) => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image
      };

      socket.emit("send-message", {
        ...newMessage,
        members: selectedChat.members.map((m) => m._id),
        read: false,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      const response = await createNewMessage(newMessage);

      if (response.success) {
        setMessage(""); // Clear the input field after sending
        getMessages(); // Refresh messages to include the new message
        setShowEmojiPicker(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        setAllMessages(response.data); // Set the messages array here
      } else {
        setAllMessages([]); // Fallback to empty array if fetching fails
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return moment(timestamp).format("MMM D, hh:mm A");
    }
  };

  const handleTimestampToggle = (messageId) => {
    // Toggle the timestamp visibility for the selected message
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
  };

  function formatName(user) {
    let fname =
      user.firstname.at(0).toUpperCase() +
      user.firstname.slice(1).toLowerCase();
    let lname =
      user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
  };

  const clearUnreadMessages = async () => {
    try{
        socket.emit('clear-unread-messages', {
            chatId: selectedChat._id,
            members: selectedChat.members.map(m => m._id)
        })
        const response = await clearUnreadMessageCount(selectedChat._id);

        if(response.success){
            allChats.map(chat => {
                if(chat._id === selectedChat._id){
                    return response.data;
                }
                return chat;
            })
        }
    }catch(error){
        toast.error(error.message);
    }
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      sendMessage(reader.result);
    }
  }

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }

    socket.on("recieve-message", (message) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (selectedChat._id === message.chatId) {
        setAllMessages((prevmsg) => [...prevmsg, message]);
      }

      if (selectedChat._id === message.chatId && message.sender !== user._id) {
        clearUnreadMessages();
      }
    });

    socket.on('message-count-cleared', data => {
      const selectedChat = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;

      if(selectedChat._id === data.chatId){
          //UPDATING UNREAD MESSAGE COUNT IN CHAT OBJECT
          const updatedChats = allChats.map(chat => {
              if(chat._id === data.chatId){
                  return { ...chat, unreadMessageCount: 0}
              }
              return chat;
          })
          dispatch(setAllChats(updatedChats));

          //UPDATING READ PROPRTY IN MESSAGE OBJECT
          setAllMessages(prevMsgs => {
              return prevMsgs.map(msg => {
                  return {...msg, read: true}
              })
          })
      }
    });

    socket.on('started-typing', (data) => {
      if(selectedChat._id === data.chatId && data.sender !== user._id){
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000)
      }
    })
  }, [selectedChat]);


  useEffect(() => {
    const msgContainer = document.getElementById("message-box");
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [allMessages, isTyping]);

  return (
    <>
      {selectedChat && (
        <div className="chat-container">
          <div className="chat-header">{formatName(selectedUser)};</div>

          <div className="message-box" id="message-box">
            {allMessages.map((msg) => {
              const isCurrentUserSender = msg.sender === user._id;

              return (
                <div
                  className="message-container"
                  style={
                    isCurrentUserSender
                      ? { justifyContent: "end" }
                      : { justifyContent: "start" }
                  }
                  key={msg._id}
                  onClick={() => handleTimestampToggle(msg._id)}
                >
                  <div>
                    <div
                      className={
                        isCurrentUserSender ? "sent-msg" : "recieved-msg"
                      }
                    >
                      <div>{msg.text}</div>
                      <div>{msg.image && <img src={msg.image} alt="image" height="120" width="120" />}</div>
                    </div>
                    {selectedMessageId === msg._id && (
                      <div
                        className="msg-timestamp"
                        style={
                          isCurrentUserSender
                            ? { float: "right" }
                            : { float: "left" }
                        }
                      >
                        {formatTime(msg.createdAt)}{" "}
                        {isCurrentUserSender && msg.read && (
                          <i
                            className="fa fa-check-circle check-mark"
                            aria-hidden="true"
                          ></i>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="typingIndicatorContainer">
              { isTyping && (
                  <div className="typingIndicatorBubble">
                    <div className="typingIndicatorBubbleDot"></div>
                    <div className="typingIndicatorBubbleDot"></div>
                    <div className="typingIndicatorBubbleDot"></div>
                  </div>
              )}
            </div>
          </div>
          
         {showEmojiPicker &&  <div>
            <EmojiPicker onEmojiClick={(e)=>  setMessage(message + e.emoji) }></EmojiPicker>
          </div>
         }
          
          <div className="send-message">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit('user-typing', {
                  chatId: selectedChat._id,
                  members: selectedChat.members.map(m => m._id),
                  sender: user._id
                })
              }}
            />
            <label for="image-file">
              <i className="fa-solid fa-paperclip send-image-btn"></i>
              <input 
                type="file"
                id="image-file"
                style={{display: 'none'}}
                accept="image/jpg, image/png, image/jpeg, image/gif"
                onChange={sendImage}
              ></input>
            </label>
            <button
              className="fa-regular fa-face-smile send-emoji-btn"
              aria-hidden="true"
              onClick={() => {setShowEmojiPicker(!showEmojiPicker)}}
            ></button>

            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={() => sendMessage('')}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;