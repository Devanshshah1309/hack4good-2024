import { OpportunityResponse, UserRole } from '../../../sharedTypes';
import {
  Card,
  CardActions,
  Button,
  CardContent,
  CardMedia,
  Typography,
  Snackbar,
} from '@mui/material';
import { PLACEHOLDER_IMAGE_URL, QueryKey, RoutePath } from '../constants';
import { authenticatedPost } from '../axios';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface OpportunityCardProps {
  opportunity: OpportunityResponse;
  userRole: UserRole | null;
}

export default function OpportunityCard({
  opportunity,
  userRole,
}: OpportunityCardProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const start = new Date(opportunity.start);
  const end = new Date(opportunity.end);

  // local date and time for both start and end
  const startDate = start.toLocaleDateString();
  const startTime = start.toLocaleTimeString();
  const endDate = end.toLocaleDateString();
  const endTime = end.toLocaleTimeString();

  const card = (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardMedia
        sx={{ minHeight: 140 }}
        image={
          opportunity.imageUrl ? opportunity.imageUrl : PLACEHOLDER_IMAGE_URL
        }
        title={opportunity.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {opportunity.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="left">
          {opportunity.description}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {opportunity.location}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="left">
          {startDate} {startTime} to {endDate} {endTime}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="left">
          Total Volunteering Hours: {opportunity.durationMinutes / 60}
        </Typography>
      </CardContent>
      {userRole === 'VOLUNTEER' && (
        <>
          <CardActions sx={{ alignSelf: 'flex-end', justifySelf: 'left' }}>
            <Button
              size="small"
              onClick={async () => {
                try {
                  await authenticatedPost(
                    `/opportunities/${opportunity.id}/enrol`,
                    undefined,
                    (await getToken()) || '',
                  );
                  setSuccessSnackbarOpen(true);
                  queryClient.invalidateQueries({
                    queryKey: [QueryKey.OPPORTUNITIES],
                  });
                } catch (err) {
                  setErrorSnackbarOpen(true);
                }
              }}
            >
              Register
            </Button>
          </CardActions>
          {!opportunity.VolunteerOpportunityEnrollment ||
          opportunity.VolunteerOpportunityEnrollment.length === 0
            ? ''
            : opportunity.VolunteerOpportunityEnrollment[0].adminApproved
            ? 'enrollment approved by admin'
            : 'enrollment NOT YET approved'}
        </>
      )}
      <Snackbar
        open={successSnackbarOpen}
        ContentProps={{
          style: {
            backgroundColor: '#2E7D32',
          },
        }}
        autoHideDuration={3000}
        message="Submitted request to enrol!"
        onClose={() => {
          setSuccessSnackbarOpen(false);
        }}
      />
      <Snackbar
        open={errorSnackbarOpen}
        ContentProps={{
          style: {
            backgroundColor: '#D32F2F',
          },
        }}
        autoHideDuration={3000}
        message="Failed to submit request!"
        onClose={() => {
          setErrorSnackbarOpen(false);
        }}
      />
    </Card>
  );

  return userRole === 'ADMIN' ? (
    <Link to={`${RoutePath.OPPORTUNITIES}/${opportunity.id}`}>{card}</Link>
  ) : (
    card
  );
}
