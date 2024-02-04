import { OpportunityResponse } from '../../../sharedTypes';
import {
  Card,
  CardActions,
  Button,
  CardContent,
  CardMedia,
  Typography,
  Snackbar,
} from '@mui/material';
import { PLACEHOLDER_IMAGE_URL } from '../constants';
import useUserRole from '../hooks/useUserRole';
import { authenticatedPost } from '../axios';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';

interface OpportunityCardProps {
  opportunity: OpportunityResponse;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { role } = useUserRole();
  const { getToken } = useAuth();
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const start = new Date(opportunity.start);
  const end = new Date(opportunity.end);

  // local date and time for both start and end
  const startDate = start.toLocaleDateString();
  const startTime = start.toLocaleTimeString();
  const endDate = end.toLocaleDateString();
  const endTime = end.toLocaleTimeString();

  return (
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
      {(!role || role === 'VOLUNTEER') && (
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
              } catch (err) {
                setErrorSnackbarOpen(true);
              }
            }}
          >
            Register
          </Button>
        </CardActions>
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
}
