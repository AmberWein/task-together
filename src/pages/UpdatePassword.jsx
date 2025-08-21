import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");

  const update = async (e) => {
    e.preventDefault();
    // אחרי שהמשתמש נכנס דרך הלינק במייל, קיימת session זמנית לעדכון
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return alert(error.message);
    alert("הסיסמה עודכנה בהצלחה!");
  };

  return (
    <form onSubmit={update} style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h2>Update Password</h2>
      <input
        type="password"
        placeholder="new password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />
      <button type="submit">Update</button>
    </form>
  );
}
