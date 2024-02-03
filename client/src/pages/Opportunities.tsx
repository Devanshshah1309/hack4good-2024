import { useQuery } from "@tanstack/react-query";
import { authenticatedGet } from "../axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import useUserRole from "../hooks/useUserRole";
import { RoutePath } from "../constants";

export default function Opportunities() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { role } = useUserRole();

  useEffect(() => {
    if (role === "ADMIN") navigate(RoutePath.ADMIN_DASHBOARD);
  }, [role]);

  const queryKey = "opportunities";
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => authenticatedGet<{ opportunities: any[] }>("/opportunities", (await getToken()) || "", navigate),
  });

  let content: any = "loading...";
  if (data) content = data.data.opportunities;

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <h1>Opportunities</h1>
        <pre>response data: {JSON.stringify(content, undefined, 2)}</pre>
      </div>
    </div>
  );
}
