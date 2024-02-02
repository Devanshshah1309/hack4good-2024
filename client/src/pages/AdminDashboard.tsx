import { useNavigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import { RoutePath } from "../constants";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const navigate = useNavigate();
  const { role } = useUserRole();

  if (role !== "ADMIN") navigate(RoutePath.ROOT);

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
}

export default AdminDashboard;
