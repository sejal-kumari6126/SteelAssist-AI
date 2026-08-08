import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(data.user));

      // Go to Home
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>SteelAssist AI</h1>
        <p>Login to your account</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1220",
  },

  card: {
    width: "400px",
    padding: "35px",
    borderRadius: "15px",
    background: "#111c35",
    color: "white",
    textAlign: "center",
  },

  error: {
    color: "#ff6b6b",
  },

  link: {
    color: "#4f8cff",
    cursor: "pointer",
  },
};

export default Login;