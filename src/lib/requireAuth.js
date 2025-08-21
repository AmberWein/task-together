import { supabase } from "./supabaseClient";

export async function requireAuth() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    window.location.href = "/login"; // שולח את המשתמש ל-login אם לא מחובר
  }
}
