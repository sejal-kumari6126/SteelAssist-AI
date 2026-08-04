function InputBox({ question, setQuestion, askAI }) {
  return (
    <div className="input-box">

      <textarea
        rows="2"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your training question..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askAI();
          }
        }}
      />

      <button onClick={askAI}>
        Send
      </button>

    </div>
  );
}

export default InputBox;