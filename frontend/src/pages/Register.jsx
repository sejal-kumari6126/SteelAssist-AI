import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>SteelAssist AI</h1>
        <p>Create your account</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

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

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  error: {
    color: "#ff6b6b",
  },

  success: {
    color: "#4ade80",
  },

  link: {
    color: "#4f8cff",
    cursor: "pointer",
  },
};

export default Register;