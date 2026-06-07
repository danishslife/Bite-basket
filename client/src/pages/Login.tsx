import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Login failed. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Welcome Back</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
        <p style={switchStyle}>
          Don't have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--primary-color)",
  padding: "20px",
};

const cardStyle: React.CSSProperties = {
  background: "var(--white-color)",
  borderRadius: "var(--border-radius-s)",
  padding: "40px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  color: "var(--primary-color)",
  marginBottom: "24px",
  fontSize: "var(--font-size-xl)",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const inputStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "var(--border-radius-s)",
  border: "1px solid var(--medium-gray-color)",
  fontSize: "var(--font-size-n)",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 16px",
  marginTop: "8px",
  background: "var(--secondary-color)",
  color: "var(--primary-color)",
  borderRadius: "var(--border-radius-m)",
  fontSize: "var(--font-size-m)",
  fontWeight: "var(--font-weight-semibold)" as unknown as number,
};

const errorStyle: React.CSSProperties = {
  background: "var(--light-pink-color)",
  color: "var(--primary-color)",
  padding: "10px 14px",
  borderRadius: "var(--border-radius-s)",
  marginBottom: "16px",
  textAlign: "center",
  fontSize: "var(--font-size-s)",
};

const switchStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "20px",
  color: "var(--dark-color)",
  fontSize: "var(--font-size-s)",
};

const linkStyle: React.CSSProperties = {
  color: "var(--secondary-color)",
  fontWeight: "var(--font-weight-semibold)" as unknown as number,
};
