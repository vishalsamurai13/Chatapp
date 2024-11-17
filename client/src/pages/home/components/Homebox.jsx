import { useEffect, useState } from "react";
import "./../home.css";
import Search from "./search";
import UserList from "./UserList";
import ChatArea from "./ChatArea";
import { useSelector } from "react-redux";

import socket from "../../../socket";

const HomeBox = () => {
  
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat, user } = useSelector(state => state.userReducer);
  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    if (user) {
      socket.emit('join-room', user._id);
      socket.emit('user-login', user._id);
      socket.on('online-users', onlineusers => {
        setOnlineUser(onlineusers);
      })
      socket.on('online-user-updated', onlineusers => {
        setOnlineUser(onlineusers);
      })
    }
  }, [user]);
  

  return (
    <div className="home-container">
      <div className="sidebar-container">
        <Search searchKey={searchKey} setSearchKey={setSearchKey} />
        <UserList searchKey={searchKey} onlineUser={onlineUser} />
      </div>
      <div className="main-container">
        {selectedChat && <ChatArea />}
      </div>
    </div>
  );
};

export default HomeBox;
