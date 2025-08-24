import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 180, background: "#f5f5f5", padding: 24 }}>
        <h3>TASKS TOGETHER</h3>
        <nav>
          <div onClick={() => navigate("/home")} style={{ margin: "16px 0", cursor: "pointer" }}>Home</div>
          <div onClick={() => navigate("/dashboard")} style={{ margin: "16px 0", cursor: "pointer" }}>Board</div>
          <div onClick={() => navigate("/profile-management")} style={{ margin: "16px 0", cursor: "pointer", fontWeight: "bold" }}>Profile</div>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        {/* Outlet is where your nested routes render */}
        <Outlet />
      </main>
    </div>
  );
}