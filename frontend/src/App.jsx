import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import WelcomeCard from "./components/WelcomeCard.jsx";
import ChatBox from "./components/Chatbox.jsx";
import InputBox from "./components/InputBox.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import ChatHistory from "./pages/ChatHistory";

import "./App.css";

const ChatPage = () => {
  const chatEndRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);

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
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="main">
      <Header />

      {messages.length === 0 && (
        <WelcomeCard setQuestion={setQuestion} />
      )}

      <ChatBox
        messages={messages}
        loading={loading}
        chatEndRef={chatEndRef}
      />

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
      
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
              <ChatHistory />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Protected Chat */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="app"
               style={{
                  display: "flex",
                  minHeight: "100vh",
                  width: "100%",
                }}>
              <Sidebar />
              <ChatPage />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;