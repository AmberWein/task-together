import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        alert(error.message);
      } else {
        navigate("/dashboard"); // or wherever you want to redirect after login
      }
    } catch (err) {
      alert("Login failed. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      alert("Please enter your email.");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send reset email");
      } else {
        alert("Password reset email sent! Please check your inbox.");
        setShowReset(false);
        setResetEmail("");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleRegister = () => {
    navigate("/register"); // or wherever your register page is
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f7f7",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "32px 24px",
        width: "320px",
        maxWidth: "90vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}>
        <h2 style={{ marginBottom: "24px", fontWeight: "bold", fontSize: "1.5rem" }}>LOGIN</h2>
        {showReset ? (
          <form onSubmit={handleResetPassword} style={{ width: "100%" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "0.95rem" }}>
              Enter your email to reset password
            </label>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              required
            />
            <button
              type="submit"
              style={{ width: "100%", padding: "12px", background: "#d3d3d3", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "1rem", marginBottom: "12px", cursor: "pointer" }}
            >
              Send Reset Email
            </button>
            <div style={{ width: "100%", textAlign: "right" }}>
              <span style={{ color: "#007bff", cursor: "pointer", fontSize: "0.95rem" }} onClick={() => setShowReset(false)}>
                Back to login
              </span>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "0.95rem" }}>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
                required
              />
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "0.95rem" }}>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
                required
              />
              <button
                type="submit"
                style={{ width: "100%", padding: "12px", background: "#d3d3d3", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "1rem", marginBottom: "12px", cursor: "pointer" }}
              >
                LOGIN
              </button>
            </form>
            <div style={{ width: "100%", textAlign: "center", marginBottom: "8px" }}>
              <span style={{ color: "#888", cursor: "pointer", fontSize: "0.95rem" }} onClick={() => setShowReset(true)}>
                Forgot your password?
              </span>
            </div>
          </>
        )}
        <div style={{
          width: "100%",
          textAlign: "center",
          margin: "12px 0",
          color: "#888",
          fontWeight: "500",
        }}>
          OR
        </div>
        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "12px",
            background: "#f5f5f5",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: "8px",
            cursor: "pointer",
          }}
        >
          REGISTER
        </button>
        <div style={{
          marginTop: "8px",
          fontSize: "0.95rem",
          color: "#888",
          textAlign: "center",
        }}>
          Don't have an account?
        </div>
      </div>
    </div>
  );
}