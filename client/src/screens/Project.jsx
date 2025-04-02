import {
  ArrowLeftFromLine,
  CircleCheckBig,
  Navigation,
  User2,
  UserPlus,
  Users2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import ChatBubble from "../components/ChatBubble";
import axios from "../config/axios";
import { initializeSocket, reciveMessage, sendMessage } from "../config/socket";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

const Project = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState([]);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const messageBox = useRef();

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });
  };

  const addMemberHandler = () => {
    axios
      .put("/project/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }

  const send = () => {
    if (message.trim().length > 0) {
      sendMessage("project-message", {
        message,
        sender: user,
      });

      setChatMessages((prev) => [
        ...prev,
        { message: message, sender: { _id: user._id, email: user.email } },
      ]);
      scrollToBottom();
      setMessage("");
    }
  };

  useEffect(() => {
    initializeSocket(location.state.project._id);

    reciveMessage("project-message", (data) => {
      console.log(Object(data));
      setChatMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/project/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative h-full rounded-r-3xl min-w-80 max-w-90 flex flex-col bg-slate-300">
        {/* header */}
        <header className="flex z-10 shadow-md absolute top-0 mb-4 bg-gray-300 rounded-r-full justify-end p-2 w-full">
          <Button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="rounded-full self-start shadow-lg cursor-pointer  p-5 bg-gray-600 active:bg-gray-400 active:text-black"
          >
            <UserPlus />
            <h1>Add Member</h1>
          </Button>
          <Button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="rounded-full ml-2 a shadow-lg cursor-pointer p-5 bg-gray-600 active:bg-gray-400 active:text-black"
          >
            <Users2 />
            <h1>All Member</h1>
          </Button>
        </header>

        {/* conversation-area */}
        <div className="onversation-area flex flex-col justify-between h-full w-full ">
          <div
            ref={messageBox}
            className="message-box py-15 flex flex-col overflow-auto"
          >
            {Array.from(chatMessages).map((chatMessage) => (
              <ChatBubble
                key={nanoid()}
                message={chatMessage.message}
                isOwn={chatMessage.sender._id === user._id}
                email={chatMessage.sender.email}
                timestamp=""
              />
            ))}
          </div>
          <form action={send}>
            <div className="inputField flex mb-1 gap-1 mx-1 bg-gray-300 border-1 border-gray-700 rounded-full ">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                className="border-none w-full pl-4 bg-transparent active:bg-transparent active:outline-none text-md focus:outline-none "
              />
              <Button
                type="submit"
                className="bg-gray-600 cursor-pointer py-5 rounded-full"
              >
                <Navigation />
              </Button>
            </div>
          </form>
        </div>

        <div
          className={`sidePanel max-h-96 overflow-auto pl-1 w-full h-full absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }  top-0`}
        >
          <header className="flex shadow-md bg-gray-300 rounded-full justify-between items-center pl-5 p-2 w-full">
            <h1 className="text-lg font-medium">All Members</h1>
            <Button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="rounded-full shadow-lg cursor-pointer p-5 bg-gray-600 active:bg-gray-400 active:text-black"
            >
              <ArrowLeftFromLine />
            </Button>
          </header>
          <div className="users flex pt-5 flex-col scroll-auto w-full">
            {project.length !== 0 &&
              project.users.map((user) => (
                <div
                  key={user._id}
                  className="user items-center gap-2 flex rounded-full p-2 bg-gray-300 shadow-lg my-2"
                >
                  <div className="p-2 bg-gray-600 text-white rounded-full">
                    <User2 />
                  </div>
                  <h1>{user?.email}</h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-4 bg-gray-800 rounded-md w-96 max-w-full relative">
            <header className="flex text-white justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 cursor-pointer"
              >
                <X />
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  onClick={() => handleUserClick(user?._id)}
                  key={user?._id}
                  className="user cursor-pointer items-center justify-between gap-2 flex rounded-full p-2 bg-gray-300 shadow-lg my-1"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="p-2 bg-gray-600 text-white rounded-full">
                      <User2 />
                    </div>
                    <h1 className="text-gray-900 text-lg">{user?.email}</h1>
                  </div>
                  <Button className="rounded-full self-end shadow-lg cursor-pointer  p-5 bg-gray-600 active:bg-gray-400 active:text-black">
                    {Array.from(selectedUserId).indexOf(user._id) != -1 ? (
                      <CircleCheckBig className="text-green-500" />
                    ) : (
                      <UserPlus />
                    )}
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={addMemberHandler}
              disabled={Array.from(selectedUserId).length === 0}
              className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-600 cursor-pointer text-white rounded-md`}
            >
              Add Members
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
