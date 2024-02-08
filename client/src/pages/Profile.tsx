import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { authenticatedGet, authenticatedPut } from '../axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  AdminGetVolunteer,
  ProfileDataResponse,
  UpdateProfileDataRequest,
} from '../../../sharedTypes';
import { QueryKey, RESIDENTIAL_STATUS_MAP, RoutePath } from '../constants';
import useUserRole from '../hooks/useUserRole';
import { Preference, ResidentialStatus } from '../../../sharedTypes';
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
import Select from '@mui/material/Select';
import { ALL_PREFERENCES } from '../constants';
import dayjs from 'dayjs';

// this page should be almost identical to
// volunteers/:id
function Profile() {
  const navigate = useNavigate();
  const { getToken, userId } = useAuth();
  const { role } = useUserRole();

  if (role === 'ADMIN') navigate(RoutePath.ROOT);

  // only these fields are editable by the user after creating a profile
  const [profileData, setProfileData] = useState<UpdateProfileDataRequest>({
    occupation: '',
    school: '',
    educationBackground: '',
    driving: false,
    ownsVehicle: false,
    commitmentLevel: '',
    phone: '',
    skills: '',
    experience: '',
    address: '',
    postalCode: '',
    preferences: [],
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [residentialStatus, setResidentialStatus] =
    useState<ResidentialStatus>('SINGAPORE_CITIZEN');
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    new Date().toISOString(),
  );
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
        occupation: data.volunteer.occupation,
        school: data.volunteer.school,
        educationBackground: data.volunteer.educationBackground,
        driving: data.volunteer.driving,
        ownsVehicle: data.volunteer.ownsVehicle,
        commitmentLevel: data.volunteer.commitmentLevel,
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
    mutationFn: async (data: UpdateProfileDataRequest) => {
      await authenticatedPut('/profile', data, (await getToken()) ?? '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] });
    },
    onError: () => {
      setErrorSnackbarOpen(true);
    },
    onSettled: () => {
      setSuccessSnackbarOpen(true);
    },
  });

  const queryKey = 'volunteer';

  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      authenticatedGet<AdminGetVolunteer>(
        `/admin/volunteers/${userId}`,
        (await getToken()) || '',
        navigate,
      ),
  });

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <Typography variant="h4" align="center" margin="2rem">
            My Profile
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
                    id="first-name"
                    label="First Name (as in NRIC/Passport)"
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
                    label="Last Name (as in NRIC/Passport)"
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
                <Grid item xs={12} md={3}>
                  <InputLabel required>Gender</InputLabel>
                  <TextField
                    fullWidth
                    id="gender"
                    disabled
                    value={gender === 'M' ? 'Male' : 'Female'}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <InputLabel required>Residential Status</InputLabel>
                  <TextField
                    fullWidth
                    id="residential-status"
                    disabled
                    value={RESIDENTIAL_STATUS_MAP[residentialStatus]}
                  />
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
                    label="Phone Number (for WhatsApp)"
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
                <Grid item xs={12} md={4}>
                  <TextField
                    id="occupation"
                    label="Occupation (e.g. engineer, student, etc.)"
                    variant="outlined"
                    fullWidth
                    value={profileData.occupation}
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
                    value={profileData.school}
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
                    value={profileData.educationBackground}
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
                    value={profileData.commitmentLevel}
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
                    value={profileData.preferences}
                    onChange={(event) => {
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
              Save Changes
            </Button>
          </div>
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
