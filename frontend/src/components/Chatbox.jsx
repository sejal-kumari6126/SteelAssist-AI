import ChatMessage from "./ChatMessage";

function ChatBox({ messages, loading, chatEndRef }) {
  return (
    <div className="chat-window">

      {messages.map((msg, index) => (
        <ChatMessage key={index} msg={msg} />
      ))}

      {loading && (
        <div className="typing">
          🤖 SteelAssist AI is typing...
        </div>
      )}

      <div ref={chatEndRef}></div>

    </div>
  );
}

export default ChatBox;