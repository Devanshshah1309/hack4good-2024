import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedGet, authenticatedPost } from "../axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { CreateOpportunityRequest } from "../../../sharedTypes";

export default function Opportunities() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const queryKey = "opportunities";

  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => authenticatedGet<{ opportunities: any[] }>("/opportunities", (await getToken()) || "", navigate),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateOpportunityRequest) => {
      await authenticatedPost("/admin/opportunities", data, (await getToken()) ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: () => {
      console.error("failed to create");
    },
    onSettled: () => {},
  });

  const [opp, setOpp] = useState({ name: "", description: "", start: new Date(), end: new Date(), durationMinutes: 60 });

  let content: any = "loading...";
  if (data) content = data.data.opportunities;

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <pre>response data: {JSON.stringify(content, undefined, 2)}</pre>

        <pre>useState data: {JSON.stringify(opp, undefined, 2)}</pre>
        <input value={opp.name} placeholder="opportunity name" onChange={(e) => setOpp({ ...opp, name: e.target.value })} />
        <input value={opp.description} placeholder="opportunity description" onChange={(e) => setOpp({ ...opp, description: e.target.value })} />
        <button onClick={() => mutation.mutate(opp)}>Add opportunity</button>
      </div>
    </div>
  );
}
