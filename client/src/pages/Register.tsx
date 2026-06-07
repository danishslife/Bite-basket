import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const mobileBreakpoint = `
  @media (max-width: 768px) {
    .register-branding-half {
      display: none !important;
    }
    .register-form-half {
      flex: 1 1 100% !important;
    }
  }
`;

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
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
      await register(name, email, password);
      navigate("/");
    } catch {
      setError("Registration failed. Please try again.");
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
        {/* Left form half */}
        <div
          className="register-form-half"
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
                Create Account
              </h2>
              <p style={{ color: "#666", fontSize: "var(--font-size-s)" }}>
                Join thousands of food lovers
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Your full name"
                required
                style={inputStyle("name")}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="your@email.com"
                required
                style={inputStyle("email")}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Min. 6 characters"
                required
                style={inputStyle("password")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                backgroundColor: "var(--secondary-color)",
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
              {loading ? "Creating account..." : "Create Account"}
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

            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "var(--font-size-s)",
                marginTop: 28,
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--secondary-color)",
                  textDecoration: "none",
                  fontWeight: "var(--font-weight-semibold)" as unknown as number,
                }}
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Right branding half */}
        <div
          className="register-branding-half"
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
            Join our food community
          </p>
          <img
            src="https://cdn.dummyjson.com/recipe-images/3.webp"
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
              fontSize: "var(--font-size-s)",
              opacity: 0.85,
              maxWidth: 300,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Share recipes. Save favorites. Cook with confidence.
          </p>
        </div>
      </div>
    </>
  );
};
