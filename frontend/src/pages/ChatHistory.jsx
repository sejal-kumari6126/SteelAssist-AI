import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatHistory = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/chat",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChats(response.data);
      } catch (err) {
        console.error("Chat history error:", err);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load chat history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1220",
        color: "white",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <h1>Chat History</h1>

      <p style={{ color: "#94a3b8" }}>
        Your previous SteelAssist AI conversations
      </p>

      {loading && <p>Loading chats...</p>}

      {error && (
        <p style={{ color: "#ff6b6b" }}>
          {error}
        </p>
      )}

      {!loading && !error && chats.length === 0 && (
        <p style={{ color: "#94a3b8" }}>
          No conversations yet.
        </p>
      )}

      {!loading &&
        !error &&
        chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              background: "#111c35",
              padding: "20px",
              marginTop: "15px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <h3>
              {chat.title || "Untitled Chat"}
            </h3>

            <p style={{ color: "#94a3b8" }}>
              {chat.createdAt
                ? new Date(chat.createdAt).toLocaleString()
                : ""}
            </p>
          </div>
        ))}

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "25px",
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default ChatHistory;