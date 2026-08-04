const WelcomeCard=({setQuestion})=>{
return(
  <div className="welcome-card">
          <h2>👋 Welcome to SteelAssist AI</h2>

          <p>
            Your AI-powered Learning & Development Assistant.
          </p>

          <div className="quick-actions">

            <button onClick={() => setQuestion("Explain Lockout Tagout")}>
              ⚙️ LOTO
            </button>

            <button onClick={() => setQuestion("What is PPE?")}>
              🦺 PPE
            </button>

            <button onClick={() => setQuestion("Fire Safety Guidelines")}>
              🔥 Fire Safety
            </button>

            <button onClick={() => setQuestion("Electrical Safety")}>
              ⚡ Electrical Safety
            </button>

          </div>
  </div>
  )
}
export default WelcomeCard;