import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const { useNavigate } = require("react-router-dom");
  const navigate = useNavigate();

  const update = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return alert(error.message);
    setSuccess(true);
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", textAlign: "center" }}>
      {success ? (
        <>
          <h2>Password updated successfully!</h2>
          <button onClick={() => navigate("/")}>Back to Login</button>
        </>
      ) : (
        <form onSubmit={update}>
          <h2>Update Password</h2>
          <input
            type="password"
            placeholder="new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
}
