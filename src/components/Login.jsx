import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed");
      } else {
        // Save JWT to localStorage
        if (data.session && data.session.access_token) {
          localStorage.setItem("jwt", data.session.access_token);
        }
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please enter email and password to register.");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (
          data.error &&
          data.error.toLowerCase().includes("already registered")
        ) {
          alert("User already exists. Please login.");
        } else {
          alert(data.error || "Registration failed");
        }
      } else {
        // Save JWT to localStorage
        if (data.session && data.session.access_token) {
          localStorage.setItem("jwt", data.session.access_token);
        }
        alert(
          "Registration successful! Please check your email to confirm your account."
        );
      }
    } catch (err) {
      alert("Network error");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
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
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2
          style={{
            marginBottom: "24px",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          LOGIN
        </h2>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              fontSize: "0.95rem",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
            required
          />
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              fontSize: "0.95rem",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
            required
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#d3d3d3",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "1rem",
              marginBottom: "12px",
              cursor: "pointer",
            }}
          >
            LOGIN
          </button>
        </form>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            margin: "12px 0",
            color: "#888",
            fontWeight: "500",
          }}
        >
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
        <div
          style={{
            marginTop: "8px",
            fontSize: "0.95rem",
            color: "#888",
            textAlign: "center",
          }}
        >
          Don't have an account?
        </div>
      </div>
    </div>
  );
}
