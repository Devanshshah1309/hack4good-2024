import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useUserRole from "../hooks/useUserRole";
import { RoutePath } from "../constants";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

// admin accounts only have email to show
function AdminProfile() {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { user } = useUser();

  useEffect(() => {
    if (role === "VOLUNTEER") navigate(RoutePath.PROFILE);
  }, [role]);

  let content = "Loading...";
  if (user) content = user.emailAddresses[0].emailAddress;

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <h1>My Account</h1>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default AdminProfile;
