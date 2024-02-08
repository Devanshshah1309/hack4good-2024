import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { authenticatedPost } from '../axios';
import { useNavigate } from 'react-router-dom';
import {
  CreateProfileDataRequest,
  Gender,
  Preference,
  ResidentialStatus,
} from '../../../sharedTypes';
import { RESIDENTIAL_STATUS_MAP, RoutePath } from '../constants';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Button,
  Chip,
  Grid,
  OutlinedInput,
  Paper,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ALL_PREFERENCES } from '../constants';
import useUserRole from '../hooks/useUserRole';

function CreateProfile() {
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { role } = useUserRole();

  useEffect(() => {
    if (!isSignedIn) navigate(RoutePath.ROOT);
    // already created profile once, redirect to opportunities
    if (role) navigate(RoutePath.OPPORTUNITIES);
  }, [isSignedIn, role]);

  // use Dayjs for date of birth
  const [gender, setGender] = useState('');
  const [residentialStatus, setResidentialStatus] = useState('');
  const [preferences, setPreferences] = useState<Preference[]>([]);

  const [profileData, setProfileData] = useState<CreateProfileDataRequest>({
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    gender: 'M',
    occupation: '',
    school: '',
    educationBackground: '',
    driving: false,
    ownsVehicle: false,
    commitmentLevel: '',
    phone: '',
    residentialStatus: 'SINGAPORE_CITIZEN',
    skills: '',
    experience: '',
    address: '',
    postalCode: '',
    preferences: [],
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateProfileDataRequest) => {
      await authenticatedPost('/profile', data, (await getToken()) ?? '');
    },
    onSuccess: () => {
      navigate(RoutePath.DASHBOARD);
    },
    onError: () => {
      console.error('failed to save');
    },
  });

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <h2>Create Profile</h2>
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
                    id="first name"
                    label="First Name"
                    variant="outlined"
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      });
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="last name"
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    required
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth"
                      sx={{ minWidth: '100%' }}
                      onChange={(newValue) => {
                        setProfileData({
                          ...profileData,
                          dateOfBirth: newValue.toDate(),
                        });
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel id="gender">Gender</InputLabel>
                  <Select
                    sx={{ width: '100%' }}
                    fullWidth
                    value={gender}
                    label="Gender"
                    required
                    onChange={(event: SelectChangeEvent) => {
                      setGender(event.target.value as string);
                      setProfileData({
                        ...profileData,
                        gender: event.target.value as Gender,
                      });
                    }}
                  >
                    <MenuItem value={'M'}>Male</MenuItem>
                    <MenuItem value={'F'}>Female</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel id="residential-status">
                    Residential Status
                  </InputLabel>
                  <Select
                    sx={{ width: '100%' }}
                    fullWidth
                    required
                    value={residentialStatus}
                    label="Residential Status"
                    onChange={(event: SelectChangeEvent) => {
                      setResidentialStatus(event.target.value as string);
                      setProfileData({
                        ...profileData,
                        residentialStatus: event.target
                          .value as ResidentialStatus,
                      });
                    }}
                  >
                    {Object.entries(RESIDENTIAL_STATUS_MAP).map(
                      ([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </Grid>
              </Grid>
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
                mutation.mutate(profileData);
              }}
            >
              Submit
            </Button>
          </div>
          <div>
            <pre>
              Me:
              <br />
              {JSON.stringify(profileData, undefined, 2)}
            </pre>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProfile;
