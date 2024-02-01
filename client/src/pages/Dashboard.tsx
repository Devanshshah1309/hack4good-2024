import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../main";

function Dashboard() {
  const { isSignedIn } = useAuth();
  let navigate = useNavigate();

  if (!isSignedIn) navigate(RoutePath.ROOT);

  return (
    <>
      <Navbar />
      <h1>Dashboard</h1>
    </>
  );
}

export default Dashboard;
