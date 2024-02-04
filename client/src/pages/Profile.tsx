import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { authenticatedGet, authenticatedPut } from '../axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ProfileDataResponse, ProfileDataRequest } from '../../../sharedTypes';
import { QueryKey, RESIDENTIAL_STATUS_MAP, RoutePath } from '../constants';
import useUserRole from '../hooks/useUserRole';
import { Preference, ResidentialStatus } from '../../../sharedTypes';
import {
  Box,
  Button,
  Chip,
  Grid,
  OutlinedInput,
  Paper,
  Snackbar,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ALL_PREFERENCES } from '../constants';
import dayjs from 'dayjs';

function Profile() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { role } = useUserRole();

  if (role === 'ADMIN') navigate(RoutePath.ROOT);

  // only these fields are editable by the user after creating a profile
  const [profileData, setProfileData] = useState<ProfileDataRequest>({
    phone: '',
    skills: '',
    experience: '',
    address: '',
    postalCode: '',
    preferences: [],
  });
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [residentialStatus, setResidentialStatus] =
    useState<ResidentialStatus>('SINGAPORE_CITIZEN');
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    new Date().toISOString(),
  );
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QueryKey.PROFILE],
    queryFn: async () => {
      const res = await authenticatedGet(
        '/profile',
        (await getToken()) ?? '',
        navigate,
      );
      const data = res.data as ProfileDataResponse;
      setProfileData({
        phone: data.volunteer.phone,
        skills: data.volunteer.skills,
        experience: data.volunteer.experience,
        address: data.volunteer.address,
        postalCode: data.volunteer.postalCode,
        preferences: data.volunteer.VolunteerPreference.map(
          (pref) => pref.preference,
        ),
      });
      setFirstName(data.volunteer.firstName);
      setLastName(data.volunteer.lastName);
      setGender(data.volunteer.gender);
      setDateOfBirth(data.volunteer.dateOfBirth);
      setResidentialStatus(data.volunteer.residentialStatus);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileDataRequest) => {
      await authenticatedPut('/profile', data, (await getToken()) ?? '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] });
    },
    onError: () => {
      setErrorSnackbarOpen(true);
      console.error('failed to save');
    },
    onSettled: () => {
      setSuccessSnackbarOpen(true);
      setSaving(false);
    },
  });

  // if (query.isLoading) return 'Loading...';

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <h2>My Account</h2>
          <form>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: '#F5F5F5',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                width: '80vw',
              }}
            >
              <Grid
                container
                padding={2}
                spacing={2}
                className="center"
                minWidth="70vw"
                alignItems={'center'}
                justifyContent="flex-start"
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    id="first-name"
                    label="First Name"
                    variant="outlined"
                    disabled
                    value={firstName}
                    fullWidth
                    required
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="last-name"
                    label="Last Name"
                    variant="outlined"
                    disabled
                    value={lastName}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled
                      label="Date of Birth"
                      sx={{ minWidth: '100%' }}
                      value={dayjs(new Date(dateOfBirth))}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel>Gender</InputLabel>
                  <TextField
                    fullWidth
                    id="gender"
                    disabled
                    value={gender === 'M' ? 'Male' : 'Female'}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel>Residential Status</InputLabel>
                  <TextField
                    fullWidth
                    id="residential-status"
                    disabled
                    value={RESIDENTIAL_STATUS_MAP[residentialStatus]}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}></Grid>
              <Grid
                container
                paddingLeft={2}
                paddingRight={2}
                spacing={2}
                className="center"
                minWidth="70vw"
                alignItems={'center'}
              >
                <Grid item xs={12} md={8}>
                  <TextField
                    id="address"
                    label="Address"
                    variant="outlined"
                    value={profileData.address}
                    fullWidth
                    required
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="postal code"
                    label="Postal Code"
                    type="number"
                    variant="outlined"
                    value={profileData.postalCode}
                    fullWidth
                    required
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        postalCode: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4} height="100%">
                  <TextField
                    id="phone"
                    label="Phone"
                    type="number"
                    value={profileData.phone}
                    variant="outlined"
                    sx={{
                      minWidth: '100%',
                      minHeight: '100%',
                    }}
                    required
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        phone: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="skills"
                    label="Skills (e.g. programming, gardening, arts and crafts, etc.)"
                    variant="outlined"
                    fullWidth
                    required
                    value={profileData.skills}
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        skills: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="experience"
                    label="Experience (e.g. I have volunteered as a math tutor for 2 years, etc.)"
                    variant="outlined"
                    fullWidth
                    required
                    value={profileData.experience}
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        experience: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Preferences</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    value={preferences as string[]}
                    onChange={(event: SelectChangeEvent) => {
                      setPreferences(event.target.value as Preference[]); // for display
                      setProfileData({
                        ...profileData,
                        preferences: event.target.value as Preference[],
                      }); // for submission
                    }}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(selected) &&
                          selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                      </Box>
                    )}
                  >
                    {ALL_PREFERENCES.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name.split('_').join(' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Paper>
          </form>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              className="center"
              style={{ marginTop: '1rem' }}
              variant="contained"
              color="success"
              onClick={() => {
                setSaving(true);
                mutation.mutate(profileData);
              }}
            >
              Save Changes
            </Button>
          </div>
          {saving && <h3>Saving...</h3>}
          <Snackbar
            open={successSnackbarOpen}
            ContentProps={{
              style: {
                backgroundColor: '#2E7D32',
              },
            }}
            autoHideDuration={3000}
            message="Changes saved successfully"
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
            message="Failed to save changes!"
            onClose={() => {
              setErrorSnackbarOpen(false);
            }}
          />
          <pre>
            Response data:
            <br />
            {JSON.stringify(query.data, undefined, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}

export default Profile;
