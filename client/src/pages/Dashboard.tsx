import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { isSignedIn } = useAuth();
  let navigate = useNavigate();

  if (!isSignedIn) navigate("/");

  return (
    <>
      <Navbar />
      <h1>Dashboard</h1>
    </>
  );
}

export default Dashboard;
