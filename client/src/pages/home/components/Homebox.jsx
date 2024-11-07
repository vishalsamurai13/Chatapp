import { useState } from "react";
import "./../home.css";
import Search from "./search";
import UserList from "./UserList";
import ChatArea from "./ChatArea";
import { useSelector } from "react-redux";

const HomeBox = () => {
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat } = useSelector(state => state.userReducer);
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
