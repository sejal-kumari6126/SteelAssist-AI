import ReactMarkdown from "react-markdown";

function ChatMessage({ msg }) {
  return (
    <div className={msg.sender === "user" ? "user-message" : "bot-message"}>
      {msg.sender === "bot" ? (
        <ReactMarkdown>{msg.text}</ReactMarkdown>
      ) : (
        msg.text
      )}
    </div>
  );
}

export default ChatMessage;