import {
  Enrollment,
  OpportunityResponse,
  UserRole,
} from '../../../server/src/types';
import {
  Card,
  CardActions,
  Button,
  CardContent,
  CardMedia,
  Typography,
  Snackbar,
  Badge,
} from '@mui/material';
import { PLACEHOLDER_IMAGE_URL, QueryKey, RoutePath } from '../constants';
import { authenticatedPost } from '../axios';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PersonIcon from '@mui/icons-material/Person';
import bigAtHeartLogo from '../assets/big-at-heart.png';
import { AxiosError } from 'axios';
interface OpportunityCardProps {
  opportunity: OpportunityResponse;
  userRole: UserRole | null;
}

export default function OpportunityCard({
  opportunity,
  userRole,
}: OpportunityCardProps) {
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorSnackbarMsg, setErrorSnackbarMsg] = useState('Request failed!');

  const start = new Date(opportunity.start);
  const end = new Date(opportunity.end);

  // local date and time for both start and end
  const startDate = start.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const startTime = start.toLocaleTimeString().substring(0, 5); // remove seconds
  const endDate = end.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const endTime = end.toLocaleTimeString().substring(0, 5); // remove seconds

  // check whether user has already enrolled
  const enrollmentStatus: Enrollment[] | undefined =
    opportunity.VolunteerOpportunityEnrollment &&
    opportunity.VolunteerOpportunityEnrollment.filter(
      (enrollment) => enrollment.volunteerId === userId,
    );

  const card = (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        backgroundColor: '#f0ead6',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardMedia
        sx={{ minHeight: 140 }}
        image={opportunity.imageUrl ? opportunity.imageUrl : bigAtHeartLogo}
        title={opportunity.name}
      />
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography gutterBottom variant="h5" component="div">
            {opportunity.name}
          </Typography>
          {/* user is volunteer, enrollment is approved */}
          {enrollmentStatus &&
            enrollmentStatus.length > 0 &&
            enrollmentStatus[0].adminApproved && (
              <DoneAllIcon color="success" />
            )}
          {/* user is volunteer, enrollment is pending approval */}
          {enrollmentStatus &&
            enrollmentStatus.length > 0 &&
            !enrollmentStatus[0].adminApproved && (
              <AutorenewIcon color="secondary" />
            )}
          {/* user is admin */}
          {opportunity._count &&
            opportunity._count.VolunteerOpportunityEnrollment !== 0 && (
              <Badge
                badgeContent={opportunity._count.VolunteerOpportunityEnrollment}
                color="primary"
              >
                <PersonIcon color="action" />
              </Badge>
            )}
        </div>
        <Typography variant="subtitle1" color="text.secondary" align="left">
          {opportunity.description}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Location: {opportunity.location}
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
              disabled={enrollmentStatus && enrollmentStatus.length > 0}
              color={
                !enrollmentStatus || enrollmentStatus.length === 0
                  ? 'primary'
                  : enrollmentStatus[0].adminApproved
                  ? 'success'
                  : 'secondary'
              }
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
                  setErrorSnackbarMsg(
                    (
                      (err as AxiosError).response?.data as {
                        error: string;
                        statusCode: number;
                        message: string;
                      }
                    )?.message ?? 'Request failed!',
                  );
                  setErrorSnackbarOpen(true);
                }
              }}
            >
              {!enrollmentStatus || enrollmentStatus.length === 0
                ? 'Register'
                : enrollmentStatus[0].adminApproved
                ? 'Registered!'
                : 'Pending Approval'}
            </Button>
          </CardActions>
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
        message={errorSnackbarMsg}
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
