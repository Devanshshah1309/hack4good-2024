import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../constants";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

function Dashboard() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) navigate(RoutePath.ROOT);
  }, [isSignedIn]);

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <h1>Dashboard</h1>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
