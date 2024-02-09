import { useQuery } from '@tanstack/react-query';
import { authenticatedGet } from '../axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useUserRole from '../hooks/useUserRole';
import { QueryKey, RoutePath } from '../constants';
import { Button, CircularProgress, Typography } from '@mui/material';
import { Grid } from '@material-ui/core';
import { OpportunityResponse } from '../../../sharedTypes';
import OpportunityCard from '../components/OpportunityCard';

export default function Opportunities() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { role } = useUserRole();

  const { data } = useQuery({
    queryKey: [QueryKey.OPPORTUNITIES],
    queryFn: async () =>
      authenticatedGet<{ opportunities: OpportunityResponse[] }>(
        '/opportunities',
        (await getToken()) || '',
        navigate,
      ),
  });

  let content: OpportunityResponse[] = [];
  if (data) content = data.data.opportunities;
  // filter out archived opportunities
  content = content.filter((opp) => opp.archive === false);
  // console.log(content);

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <Typography variant="h4" align="center" margin="2rem">
          Volunteering Opportunities
        </Typography>
        {role === 'ADMIN' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate(RoutePath.OPPORTUNITY_CREATE)}
            >
              Create New Opportunity
            </Button>
          </div>
        )}
        <Grid container spacing={3} style={{ width: '70vw' }}>
          {content.map((opp) => (
            <Grid item xs={4} key={opp.id}>
              <OpportunityCard opportunity={opp} userRole={role} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
