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
} from '../../../server/src/types';
import { RESIDENTIAL_STATUS_MAP, RoutePath } from '../constants';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
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
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const [profileData, setProfileData] = useState<CreateProfileDataRequest>({
    firstName: '',
    lastName: '',
    dateOfBirth: new Date().toUTCString(),
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
    onSuccess: () => {},
    onError: () => {
      setErrorSnackbarOpen(true);
      console.error('failed to save');
    },
  });

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <Typography variant="h4" align="center" margin="2rem">
            Create Profile
          </Typography>
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
                    label="First Name (as in NRIC/Passport)"
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
                    label="Last Name (as in NRIC/Passport)"
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
                <Grid item xs={12} md={3}>
                  <InputLabel id="gender" required>
                    Gender
                  </InputLabel>
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
                <Grid item xs={12} md={3}>
                  <InputLabel id="residential-status" required>
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
                <Grid item xs={12} md={3}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <InputLabel sx={{ width: '100%', alignContent: 'center' }}>
                      Can you drive?
                    </InputLabel>
                    <RadioGroup
                      row
                      sx={{ width: '100%' }}
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={profileData.driving ? 'Yes' : 'No'}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                        onChange={() => {
                          setProfileData({
                            ...profileData,
                            driving: true,
                          });
                        }}
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                        onChange={() => {
                          setProfileData({
                            ...profileData,
                            driving: false,
                          });
                        }}
                      />
                    </RadioGroup>
                  </div>
                </Grid>
                <Grid item xs={12} md={3}>
                  <InputLabel>Do you own a vehicle?</InputLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={profileData.ownsVehicle ? 'Yes' : 'No'}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                      onChange={() => {
                        setProfileData({
                          ...profileData,
                          ownsVehicle: true,
                        });
                      }}
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                      onChange={() => {
                        setProfileData({
                          ...profileData,
                          ownsVehicle: false,
                        });
                      }}
                    />
                  </RadioGroup>
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
                    label="Phone Number (for WhatsApp)"
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
                <Grid item xs={12} md={4}>
                  <TextField
                    id="occupation"
                    label="Occupation (e.g. engineer, student, etc.)"
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        occupation: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="school"
                    label="School/University Name (if applicable)"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        school: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="education-background"
                    label="Education Background (e.g. Diploma in Business)"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        educationBackground: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="commitment-level"
                    label="Availability (e.g. I'm generally free on saturdays)"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        commitmentLevel: e.target.value,
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
                // form validation
                if (
                  profileData.firstName === '' ||
                  profileData.lastName === '' ||
                  gender === '' ||
                  residentialStatus === '' ||
                  profileData.phone === '' ||
                  profileData.address === '' ||
                  profileData.postalCode === '' ||
                  profileData.occupation === ''
                ) {
                  setErrorSnackbarOpen(true);
                  return;
                }
                mutation.mutate(profileData);
              }}
            >
              Submit
            </Button>
          </div>
          <Snackbar
            open={errorSnackbarOpen}
            ContentProps={{
              style: {
                backgroundColor: '#D32F2F',
              },
            }}
            autoHideDuration={3000}
            onClose={() => setErrorSnackbarOpen(false)}
            message="Failed to create profile!"
          />
          <div style={{ height: '10vh' }} />
        </div>
      </div>
    </>
  );
}

export default CreateProfile;
