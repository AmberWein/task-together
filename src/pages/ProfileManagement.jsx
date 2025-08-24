import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProfileManagement() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        alert("Please login first.");
        navigate("/login");
        return;
      }
      setName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
      setLoading(false);
    }
    fetchProfile();
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    let errorMsg = "";
    // Update name
    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    if (metaError) errorMsg += metaError.message + "\n";
    // Update email
    // if (email) {
    //   const { error: emailError } = await supabase.auth.updateUser({ email });
    //   if (emailError) errorMsg += emailError.message + "\n";
    // }
    // Update password
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) errorMsg += passError.message + "\n";
    }
    setLoading(false);
    if (errorMsg) {
      alert(errorMsg);
    } else {
      alert("Profile updated successfully!");
      setPassword("");
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 180, background: "#f5f5f5", padding: 24 }}>
        <h3>TASKS</h3>
        <nav>
          <div
            style={{ margin: "16px 0", color: "#333", cursor: "pointer" }}
            onClick={() => navigate("/home")}>
            Home
          </div>
          <div style={{ margin: "16px 0", color: "#333" }}>Board</div>
          <div style={{ margin: "16px 0", color: "#333", fontWeight: "bold" }}>
            Profile
          </div>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 48 }}>
        <h2 style={{ marginBottom: 32 }}>Profile</h2>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 32 }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              marginRight: 32,
            }}
          >
            <span role="img" aria-label="profile">
              👤
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>
            {name || "User"}
          </div>
        </div>
        <form onSubmit={handleSave} style={{ maxWidth: 400 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 16,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "block", marginBottom: 8 }}>Email</label>
          <input
            type="email"
            value={email}
            readOnly
            style={{
              width: "100%",
              marginBottom: 16,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "block", marginBottom: 8 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 24,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "40%",
              padding: 12,
              borderRadius: 6,
              border: "none",
              background: "#d3d3d3",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </form>
      </main>
    </div>
  );
}
