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

    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    if (metaError) errorMsg += metaError.message + "\n";

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
    <div>
      <h2 style={{ marginBottom: 24 }}>Profile</h2>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {/* Avatar */}
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
          <span role="img" aria-label="profile">👤</span>
        </div>
        {/* שם המשתמש */}
        <div style={{ fontSize: 28, fontWeight: "bold" }}>
          {name || "User"}
        </div>
      </div>
      {/* טופס עדכון */}
      <form onSubmit={handleSave} style={{ maxWidth: 400 }}>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input type="email" value={email} readOnly />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}