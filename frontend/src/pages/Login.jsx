import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/chat");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          🤖
        </div>

        <h1>SteelAssist AI</h1>

        <p className="login-subtitle">
          Your AI Learning & Development Assistant
        </p>

        <div className="login-divider"></div>

        <h2>Welcome Back</h2>

        <p className="login-description">
          Login to continue your personalized learning experience.
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit" className="login-button">
            Login
            <span>→</span>
          </button>

        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="register-link"
          >
            Create an account
          </span>
        </p>

        <div className="ai-badge">
          🤖 AI Powered
        </div>

      </div>
    </div>
  );
}

export default Login;