import { useEffect } from 'react';
import { requireAuth } from '../lib/requireAuth';

export default function Dashboard() {
  useEffect(() => {
    requireAuth(); // כאן בודקים אם המשתמש מחובר, אם לא – נשלח ל-login
  }, []);

  return <h1>Welcome to the dashboard!</h1>;
}
