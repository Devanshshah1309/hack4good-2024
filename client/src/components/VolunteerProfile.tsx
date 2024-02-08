import {
  Box,
  Chip,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  Select,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Preference, ProfileDataResponse } from '../../../sharedTypes';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { RESIDENTIAL_STATUS_MAP, ALL_PREFERENCES } from '../constants';

type VolunteerProfileProps = {
  user: ProfileDataResponse;
  shouldAllBeDisabled?: boolean;
};

export default function VolunteerProfile({
  user,
  shouldAllBeDisabled = false,
}: VolunteerProfileProps) {
  if (!user.volunteer) return null;
  const volunteer = user.volunteer;
  const preferences: Preference[] =
    volunteer.VolunteerPreference.map(({ preference }) => {
      return preference;
    }) || [];
  console.log(preferences);
  return (
    <div>
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
              value={volunteer.firstName}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="last-name"
              label="Last Name (as in NRIC/Passport)"
              variant="outlined"
              disabled
              value={volunteer.lastName}
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
                value={dayjs(new Date(volunteer.dateOfBirth))}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <InputLabel required>Gender</InputLabel>
            <TextField
              fullWidth
              id="gender"
              disabled
              value={volunteer.gender === 'M' ? 'Male' : 'Female'}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputLabel required>Residential Status</InputLabel>
            <TextField
              fullWidth
              id="residential-status"
              disabled
              value={RESIDENTIAL_STATUS_MAP[volunteer.residentialStatus]}
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
                value={volunteer.driving ? 'Yes' : 'No'}
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes"
                  disabled={shouldAllBeDisabled}
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No"
                  disabled={shouldAllBeDisabled}
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
              value={volunteer.ownsVehicle ? 'Yes' : 'No'}
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                disabled={shouldAllBeDisabled}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                disabled={shouldAllBeDisabled}
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
              value={volunteer.address}
              fullWidth
              required
              disabled={shouldAllBeDisabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="postal code"
              label="Postal Code"
              type="number"
              variant="outlined"
              value={volunteer.postalCode}
              fullWidth
              disabled={shouldAllBeDisabled}
              required
            />
          </Grid>
          <Grid item xs={12} md={4} height="100%">
            <TextField
              id="phone"
              label="Phone Number (for WhatsApp)"
              type="number"
              value={volunteer.phone}
              variant="outlined"
              disabled={shouldAllBeDisabled}
              sx={{
                minWidth: '100%',
                minHeight: '100%',
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              id="skills"
              label="Skills (e.g. programming, gardening, arts and crafts, etc.)"
              variant="outlined"
              fullWidth
              required
              disabled={shouldAllBeDisabled}
              value={volunteer.skills}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="experience"
              label="Experience (e.g. I have volunteered as a math tutor for 2 years, etc.)"
              variant="outlined"
              fullWidth
              required
              disabled={shouldAllBeDisabled}
              value={volunteer.experience}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="occupation"
              label="Occupation (e.g. engineer, student, etc.)"
              variant="outlined"
              fullWidth
              required
              disabled={shouldAllBeDisabled}
              value={volunteer.occupation}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="school"
              label="School/University Name (if applicable)"
              variant="outlined"
              fullWidth
              disabled={shouldAllBeDisabled}
              value={volunteer.school}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="education-background"
              label="Education Background (e.g. Diploma in Business)"
              variant="outlined"
              fullWidth
              value={volunteer.educationBackground}
              disabled={shouldAllBeDisabled}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="commitment-level"
              label="Availability (e.g. I'm generally free on saturdays)"
              variant="outlined"
              fullWidth
              value={volunteer.commitmentLevel}
              disabled={shouldAllBeDisabled}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Preferences</InputLabel>
            <Select
              multiple
              fullWidth
              disabled={shouldAllBeDisabled}
              value={(preferences as string[]) || []}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) &&
                    selected.map((value) => (
                      <Chip key={value} label={value.split('_').join(' ')} />
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
    </div>
  );
}
