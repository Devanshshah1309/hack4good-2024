import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authenticatedPost } from '../axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { CreateOpportunityRequest } from '../../../sharedTypes';
import axios from 'axios';
import useUserRole from '../hooks/useUserRole';
import { QueryKey, RoutePath } from '../constants';
import { Grid, Paper, Snackbar, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InputLabel } from '@material-ui/core';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Dayjs } from 'dayjs';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreateOpportunity() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { role } = useUserRole();

  useEffect(() => {
    if (role !== 'ADMIN') navigate(RoutePath.DASHBOARD);
  }, [role]);

  const [opp, setOpp] = useState<
    Omit<CreateOpportunityRequest, 'imageUrl' | 'archive'>
  >({
    name: '',
    description: '',
    start: new Date(),
    end: new Date(),
    location: '',
    durationMinutes: 0,
  });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  async function uploadImageFileToCloudinary(): Promise<CreateOpportunityRequest> {
    const oppCopy: CreateOpportunityRequest = {
      ...opp,
      imageUrl: '',
      archive: false,
    };

    if (!imgFile) {
      console.log('file is', imgFile);
      return oppCopy;
    }

    const uploadUrl = import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET;

    // check if .env variable has been read correctly
    console.log(uploadPreset);

    console.log('Uploading file...');
    const formData = new FormData();
    formData.append('file', imgFile);
    formData.append('upload_preset', uploadPreset);

    const res = await axios.post<{
      secure_url: string;
      original_filename: string;
    }>(uploadUrl, formData);
    console.log(res.data);

    oppCopy.imageUrl = res.data.secure_url;
    return oppCopy;
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const oppCopy = await uploadImageFileToCloudinary();
      await authenticatedPost(
        '/admin/opportunities',
        oppCopy,
        (await getToken()) ?? '',
      );
    },
    onSuccess: () => {
      setSuccessSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: [QueryKey.OPPORTUNITIES] });
    },
    onError: () => {
      setErrorSnackbarOpen(true);
      console.error('failed to create');
    },
    onSettled: () => {},
  });

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <h2>Create Volunteering Opportunity</h2>

        {role === 'ADMIN' && (
          <>
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
                  <Grid item xs={4}>
                    <TextField
                      value={opp.name}
                      variant="outlined"
                      label="Opportunity Name"
                      required
                      fullWidth
                      onChange={(e) => setOpp({ ...opp, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      value={opp.description}
                      variant="outlined"
                      label="Description"
                      required
                      fullWidth
                      onChange={(e) =>
                        setOpp({ ...opp, description: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      value={
                        opp.durationMinutes === 0
                          ? ''
                          : opp.durationMinutes / 60
                      }
                      variant="outlined"
                      label="Volunteering Hours"
                      type="number"
                      required
                      fullWidth
                      onChange={(e) =>
                        setOpp({
                          ...opp,
                          durationMinutes: +e.target.value * 60,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      value={opp.location}
                      variant="outlined"
                      label="Location (e.g. Tampines Changkat CC)"
                      required
                      fullWidth
                      onChange={(e) =>
                        setOpp({ ...opp, location: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel>Start Date and Time</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        sx={{ width: '100%' }}
                        onChange={(newValue: Dayjs | null) => {
                          if (newValue) {
                            setOpp({ ...opp, start: newValue.toDate() });
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel>End Date and Time</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        sx={{ width: '100%' }}
                        onChange={(newValue: Dayjs | null) => {
                          if (newValue) {
                            setOpp({ ...opp, end: newValue.toDate() });
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={4}>
                    {imgFile && (
                      <InputLabel>{imgFile.name} uploaded</InputLabel>
                    )}
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Click here to upload image
                      <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          setImgFile(
                            e.target.files!.length === 0
                              ? null
                              : e.target.files![0],
                          );
                        }}
                      />
                    </Button>
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
                  mutation.mutate();
                }}
              >
                Submit
              </Button>
              <Snackbar
                open={successSnackbarOpen}
                ContentProps={{
                  style: {
                    backgroundColor: '#2E7D32',
                  },
                }}
                autoHideDuration={3000}
                message="New volunteering opportunity created!"
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
                message="Failed to create volunteering opportunity!"
                onClose={() => {
                  setErrorSnackbarOpen(false);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
