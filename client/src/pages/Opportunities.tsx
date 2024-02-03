import { useQuery } from "@tanstack/react-query";
import { authenticatedGet } from "../axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import useUserRole from "../hooks/useUserRole";
import { RoutePath } from "../constants";
import { Button } from "@mui/material";
import { Grid } from "@material-ui/core";
import { OpportunityResponse } from "../../../sharedTypes";
import OpportunityCard from "../components/OpportunityCard";

export default function Opportunities() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { role } = useUserRole();

  const queryKey = "opportunities";
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      authenticatedGet<{ opportunities: any[] }>(
        "/opportunities",
        (await getToken()) || "",
        navigate
      ),
  });

  let content: OpportunityResponse[] = [];
  if (data) content = data.data.opportunities;

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <h2>Volunteering Opportunities</h2>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate(RoutePath.OPPORTUNITY_CREATE)}
          >
            Create New Opportunity
          </Button>
        </div>
        <Grid container spacing={3} style={{ width: "70vw" }}>
          {content.map((opp) => (
            <Grid item xs={4} key={opp.id}>
              <OpportunityCard opportunity={opp} />
            </Grid>
          ))}
        </Grid>
        {/* <pre>response data: {JSON.stringify(content, undefined, 2)}</pre> */}
      </div>
    </div>
  );
}
