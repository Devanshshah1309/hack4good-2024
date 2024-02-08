import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import useUserRole from '../hooks/useUserRole';
import { useEffect } from 'react';
import { authenticatedGet } from '../axios';
import { useQuery } from '@tanstack/react-query';
import { ReportDataResponse } from '../../../sharedTypes';
import { Grid, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getAge } from '../utils';
import { RESIDENTIAL_STATUS_MAP } from '../constants';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function ReportPage() {
  const { role } = useUserRole();
  const { userId, getToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== 'ADMIN') navigate('/opportunities');
  }, [role, navigate]);
  const queryKey = 'report';
  const { data } = useQuery({
    queryKey: ['report'],
    queryFn: async () =>
      authenticatedGet<ReportDataResponse>(
        `/admin/report-data`,
        (await getToken()) || '',
        navigate,
      ),
  });
  useEffect(() => {
    if (data?.data === undefined) {
      navigate('/opportunities');
    }
  }, [data, navigate]);

  // GENDER DATA
  const maleVolunteersCount =
    data?.data.volunteers.filter((volunteer) => volunteer.gender == 'M')
      .length || 0;
  const femaleVounteersCount =
    (data?.data.volunteers.length || 0) - maleVolunteersCount;
  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: '# Volunteers',
        data: [maleVolunteersCount, femaleVounteersCount],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // AGE DATA

  const ageLabels = [
    '10-20',
    '20-30',
    '30-40',
    '40-50',
    '50-60',
    '60-70',
    '70-80',
  ];
  const ageData = Array(7).fill(0);
  data?.data.volunteers.forEach((volunteer) => {
    const age = getAge(volunteer.dateOfBirth);
    if (age < 10 || age > 80) return;
    const index = Math.floor(age / 10) - 1;
    ageData[index]++;
  });

  // RESIDENCY STATUS DATA
  const residentialStatusLabels = new Map<string, number>();
  data?.data.volunteers.forEach((volunteer) => {
    const status = RESIDENTIAL_STATUS_MAP[volunteer.residentialStatus];
    if (status) {
      residentialStatusLabels.set(
        status,
        (residentialStatusLabels.get(status) || 0) + 1,
      );
    }
  });

  // PREFERENCES DATA
  const allVolunteerPreferences = data?.data.volunteers.flatMap(
    (volunteer) => volunteer.preferences,
  );
    const preferences = new Map<string, number>();
    allVolunteerPreferences.forEach((preference) => {
        preferences.set(preference, (preferences.get(preference) || 0) + 1);
        }


  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main" style={{ maxWidth: '100px' }}>
          <Typography variant="h4" align="center" margin="2rem">
            Reports
          </Typography>
          <Typography variant="h5" align="center">
            Volunteer Distribution
          </Typography>
          <Grid container spacing={2} maxWidth="80vw">
            <Grid item xs={12} md={4}>
              <Pie
                data={genderData}
                title="By Gender"
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'By Gender',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} display="flex">
              <Bar
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'By Age',
                    },
                  },
                }}
                style={{ alignSelf: 'center' }}
                data={{
                  labels: ageLabels,
                  datasets: [
                    {
                      label: '# Volunteers',
                      data: ageData,
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Pie
                data={{
                  labels: Array.from(residentialStatusLabels.keys()),
                  datasets: [
                    {
                      label: '# Volunteers',
                      data: Array.from(residentialStatusLabels.values()),
                      backgroundColor: [
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(210, 130, 150, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(210, 130, 150, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                title="By Residential Status"
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'By Residential Status',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          <pre>{JSON.stringify(data?.data, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
