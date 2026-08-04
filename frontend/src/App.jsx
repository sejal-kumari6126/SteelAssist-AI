import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import WelcomeCard from "./components/WelcomeCard.jsx";
import ChatBox from "./components/Chatbox.jsx";
import InputBox from "./components/InputBox.jsx";

import "./App.css";

const App=() =>{
  const chatEndRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
      const userQuestion=question;
      setQuestion("");
      setLoading(true);

    //user message immediately
       setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userQuestion,
    },
  ]);
    try {
       console.log("Sending request...");
      const res = await axios.post("http://localhost:5000/ask", {
      question: userQuestion,
    });
    console.log("Response:", res.data);

      //AI response
    setMessages((prev) => [...prev,{
        sender: "bot",
        text: res.data.answer,
        },
      ]);
    } 
      catch (err) {
        console.log(err);
      }
      finally {
          setLoading(false);
        }
  };
    useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: "smooth"});}, [messages]);

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
      <Header />

      {messages.length === 0 && (
      <WelcomeCard setQuestion={setQuestion} />)}

      <ChatBox messages={messages} loading={loading} chatEndRef={chatEndRef}/>
      <InputBox question={question} setQuestion={setQuestion} askAI={askAI} />
    </div>
    
    </div>
  );
}

export default App;