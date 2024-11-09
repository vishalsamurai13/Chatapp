import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import moment from "moment";
import { clearUnreadMessageCount } from "./../../../apiCalls/chat";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
  const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const sendMessage = async () => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
      };
      dispatch(showLoader());
      const response = await createNewMessage(newMessage);
      dispatch(hideLoader());

      if (response.success) {
        setMessage(""); // Clear the input field after sending
        getMessages(); // Refresh messages to include the new message
      }
    } catch (error) {
      dispatch(hideLoader());
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
    const diff = now.diff(moment(timestamp), 'days')

    if(diff < 1){
      return `Today ${moment(timestamp).format('hh:mm A')}`;
    }
    else if(diff===1){
      return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
    }
    else {
      return moment(timestamp).format('MMM D, hh:mm A');
    }
  }

  const handleTimestampToggle = (messageId) => {
    // Toggle the timestamp visibility for the selected message
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
  };

  function formatName(user){
    let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
    let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
  }

  const clearUnreadMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await clearUnreadMessageCount(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        allChats.map(chat => {
          if(chat._id === selectedChat._id){
            return response.data;
          }
          return chat;
        })
      } else {
        setAllMessages([]); // Fallback to empty array if fetching fails
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getMessages();
    if(selectedChat?.lastMessage?.sender !== user._id){
      clearUnreadMessages();
    }  
  }, [selectedChat]);

  return (
    <>
      {selectedChat && (
        <div className="chat-container">
          <div className="chat-header">
            {formatName(selectedUser)};
          </div>

          <div className="message-box">
            {allMessages.map((msg) => {
              const isCurrentUserSender = msg.sender === user._id;

              return (
                <div 
                  className="message-container" 
                  style={isCurrentUserSender ? {justifyContent: 'end'} : {justifyContent: 'start'}}
                  key={msg._id}
                  onClick={() => handleTimestampToggle(msg._id)}
                >
                  <div>
                    <div className={ isCurrentUserSender ? "sent-msg" : "recieved-msg" }>
                      {msg.text}
                    </div>
                    {selectedMessageId === msg._id && (
                      <div 
                      className="msg-timestamp" 
                      style={isCurrentUserSender ? {float: 'right'} : {float: "left"}}
                      >
                        {formatTime(msg.createdAt)} {isCurrentUserSender && msg.read && <i className="fa fa-check-circle" aria-hidden="true" style={{color: "blue"}}></i>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="send-message">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={sendMessage}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
