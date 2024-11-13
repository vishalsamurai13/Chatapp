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

  useEffect(() => {
    if (user) {
      socket.emit('join-room', user._id);
    }
  }, [user]);
  

  return (
    <div className="home-container">
      <div className="sidebar-container">
        <Search searchKey={searchKey} setSearchKey={setSearchKey} />
        <UserList searchKey={searchKey} />
      </div>
      <div className="main-container">
        {selectedChat && <ChatArea />}
      </div>
    </div>
  );
};

export default HomeBox;
