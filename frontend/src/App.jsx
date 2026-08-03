import { useState } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ReactMarkdown from "react-markdown";
import { FaRobot } from "react-icons/fa";

import "./App.css";

const App=() =>{
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    try {
      if (!question.trim()) return;
      setLoading(true);

      const res = await axios.post("http://localhost:5000/ask", {
        question,
      });

      setAnswer(res.data.answer);
      setQuestion("");
    } 
    catch (err) {
      console.log(err);
    }
    finally {
        setLoading(false);
      }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
      <Header />

      <div className="welcome-card">
        
        <h2>Hello 👋</h2>
        <p>
          I'm <b>SteelAssist AI</b>, your AI Learning & Development Assistant.
          Ask me anything related to training, safety, SOPs and policies.
        </p>
      </div>

      <div className="chat-window">
        {loading && (
        <div className="typing">
          🤖 SteelAssist AI is typing...
        </div>
      )}

        {question && (
          <div className="user-message">
            {question}
          </div>
        )}

        {answer && (
          <div className="bot-message">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
          )}

      </div>

      <div className="input-box">

        <textarea
          rows="2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your training question..."
        />

        <button onClick={askAI}>
          Send
        </button>

  </div>

</div>
    </div>
  );
}

export default App;