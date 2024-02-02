import { useNavigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import { RoutePath } from "../constants";

function AdminDashboard() {
  const navigate = useNavigate();
  const { role } = useUserRole();

  if (role !== "ADMIN") navigate(RoutePath.ROOT);

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}

export default AdminDashboard;
