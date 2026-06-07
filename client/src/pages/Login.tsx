import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const mobileBreakpoint = `
  @media (max-width: 768px) {
    .login-branding-half {
      display: none !important;
    }
    .login-form-half {
      flex: 1 1 100% !important;
    }
  }
`;

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    border: `2px solid ${focusedField === field ? "var(--secondary-color)" : "#eee"}`,
    borderRadius: "var(--border-radius-s)",
    fontSize: "var(--font-size-s)",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.3s ease",
    backgroundColor: "transparent",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 6,
    color: "var(--dark-color)",
    fontSize: "var(--font-size-s)",
    fontWeight: "var(--font-weight-medium)" as unknown as number,
  };

  return (
    <>
      <style>{mobileBreakpoint}</style>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          marginTop: "-60px",
          paddingTop: 0,
        }}
      >
        {/* Left branding half */}
        <div
          className="login-branding-half"
          style={{
            flex: 1,
            backgroundColor: "var(--primary-color)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
            gap: 24,
          }}
        >
          <h1
            style={{
              fontFamily: "'Miniver', cursive",
              color: "var(--secondary-color)",
              fontSize: "3rem",
              fontWeight: 400,
            }}
          >
            BiteBasket
          </h1>
          <p
            style={{
              color: "var(--white-color)",
              fontSize: "var(--font-size-m)",
              letterSpacing: 1,
            }}
          >
            Discover. Cook. Enjoy.
          </p>
          <img
            src="https://cdn.dummyjson.com/recipe-images/1.webp"
            alt="Delicious food"
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--secondary-color)",
            }}
          />
          <p
            style={{
              color: "var(--white-color)",
              fontStyle: "italic",
              fontSize: "var(--font-size-s)",
              opacity: 0.85,
              maxWidth: 280,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            "The secret ingredient is always love."
          </p>
        </div>

        {/* Right form half */}
        <div
          className="login-form-half"
          style={{
            flex: 1,
            backgroundColor: "var(--white-color)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <div style={{ marginBottom: 32 }}>
              <h2
                style={{
                  color: "var(--primary-color)",
                  fontSize: "var(--font-size-xl)",
                  fontWeight: "var(--font-weight-bold)" as unknown as number,
                  marginBottom: 8,
                }}
              >
                Welcome Back
              </h2>
              <p style={{ color: "#666", fontSize: "var(--font-size-s)" }}>
                Sign in to your account
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                style={inputStyle("email")}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                style={inputStyle("password")}
              />
            </div>

            <div
              style={{
                textAlign: "right",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  color: "var(--secondary-color)",
                  fontSize: "var(--font-size-s)",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                backgroundColor: loading
                  ? "var(--secondary-color)"
                  : "var(--secondary-color)",
                color: "var(--primary-color)",
                border: "none",
                borderRadius: "var(--border-radius-m)",
                fontSize: "var(--font-size-m)",
                fontWeight: "var(--font-weight-bold)" as unknown as number,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: loading ? 0.7 : 1,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor =
                    "var(--primary-color)";
                  e.currentTarget.style.color = "var(--white-color)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor =
                    "var(--secondary-color)";
                  e.currentTarget.style.color = "var(--primary-color)";
                }
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {error && (
              <p
                style={{
                  color: "#e53935",
                  fontSize: "var(--font-size-s)",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                {error}
              </p>
            )}

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "28px 0",
              }}
            >
              <div
                style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }}
              />
              <span
                style={{
                  color: "#999",
                  fontSize: "var(--font-size-s)",
                }}
              >
                or
              </span>
              <div
                style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }}
              />
            </div>

            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "var(--font-size-s)",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--secondary-color)",
                  textDecoration: "none",
                  fontWeight: "var(--font-weight-semibold)" as unknown as number,
                }}
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
