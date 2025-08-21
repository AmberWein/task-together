import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin access
);

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists using Supabase Admin API
  const adminRes = await fetch(
    `${process.env.SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(
      email
    )}`,
    {
      headers: {
        apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!adminRes.ok) {
    return res.status(500).json({ error: "Failed to check user existence." });
  }
  const adminData = await adminRes.json();
  if (adminData.users && adminData.users.length > 0) {
    return res
      .status(400)
      .json({ error: "User already exists. Please login." });
  }
  // Register new user
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});

// Reset (שליחת מייל לאיפוס)
app.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${
      process.env.SITE_URL || "http://localhost:3000"
    }/update-password`,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
