import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import WelcomeCard from "./components/WelcomeCard.jsx";
import ChatBox from "./components/Chatbox.jsx";
import InputBox from "./components/InputBox.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import "./App.css";

const ChatPage = () => {
  const chatEndRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(localStorage.getItem("currentChatId"));
  const askAI = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userQuestion,
      },
    ]);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Please login first.",
          },
        ]);
        return;
      }

      let currentChatId = chatId;

      // Create chat
      if (!currentChatId) {
        const chatResponse = await axios.post(
          "http://localhost:5000/api/chat",
          {
            title: userQuestion.substring(0, 40),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        currentChatId = chatResponse.data.id;
        setChatId(currentChatId);
      }

      console.log("Sending question...");
      console.log("Chat ID:", currentChatId);

      // Ask AI
      const res = await axios.post(
        "http://localhost:5000/ask",
        {
          question: userQuestion,
          chatId: currentChatId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AI Response:", res.data);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.answer,
        },
      ]);
    } catch (err) {
      console.error("Chat Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}, [messages]);useEffect(() => {
  const loadChat = async () => {
    const token = localStorage.getItem("token");
    const savedChatId = localStorage.getItem("currentChatId");

    if (!token || !savedChatId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/${savedChatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(
        response.data.messages.map((msg) => ({
          sender: msg.sender,
          text: msg.message,
        }))
      );
    } catch (err) {
      console.error("Load Chat Error:", err);
    }
  };

  loadChat();
}, []);useEffect(() => {
  const loadChat = async () => {
    const token = localStorage.getItem("token");
    const savedChatId = localStorage.getItem("currentChatId");

    if (!token || !savedChatId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/${savedChatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(
        response.data.messages.map((msg) => ({
          sender: msg.sender,
          text: msg.message,
        }))
      );
    } catch (err) {
      console.error("Load Chat Error:", err);
    }
  };

  loadChat();
}, []);

  return (
    <div className="chat-page">
      <Header />

      <div className="chat-content">
        {messages.length === 0 && (
          <WelcomeCard setQuestion={setQuestion} />
        )}

        <ChatBox
          messages={messages}
          loading={loading}
          chatEndRef={chatEndRef}
        />
      </div>

      <InputBox
        question={question}
        setQuestion={setQuestion}
        askAI={askAI}
      />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Register */}
      <Route path="/register" element={<Register />} />

      {/* Protected Chat */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="app">
              <ChatPage />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;