import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import useUserRole from '../hooks/useUserRole';
import { useEffect } from 'react';
import { authenticatedGet } from '../axios';
import { useQuery } from '@tanstack/react-query';
import { ReportDataResponse } from '../../../sharedTypes';
import { Grid, Paper, Typography } from '@mui/material';
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
  PointElement,
  LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  formatEnum,
  getAge,
  getDifferenceInMonths,
  getPastNMonths,
} from '../utils';
import { RESIDENTIAL_STATUS_MAP } from '../constants';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function ReportPage() {
  const { role } = useUserRole();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== 'ADMIN') navigate('/opportunities');
  }, [role, navigate]);
  const queryKey = 'report';
  const { data } = useQuery({
    queryKey: [queryKey],
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
  const preferences = new Map<string, number>();
  data?.data.volunteers
    .flatMap((volunteer) => volunteer.VolunteerPreference)
    .forEach((preference) => {
      preferences.set(
        preference.preference,
        (preferences.get(preference.preference) || 0) + 1,
      );
    });

  // OPPOURTUNITIES DATA
  // show number of opportunities in the past 6 months
  const opportunities = Array(6).fill(0);
  data?.data.opportunities.forEach((opportunity) => {
    const date = new Date(opportunity.start);
    const diff = getDifferenceInMonths(date);
    if (diff < 6) {
      opportunities[diff]++;
    }
  });

  // show number of enrollments (marked didAttend) in the past 6 months
  // create map from opportunity id to start date
  const opportunityIdToStartDate = new Map<string, Date>();
  data?.data.opportunities.forEach((opportunity) => {
    opportunityIdToStartDate.set(opportunity.id, new Date(opportunity.start));
  });
  const enrollments = Array(6).fill(0);
  data?.data.enrollments.forEach((enrollment) => {
    if (!enrollment.didAttend) return;
    const date = opportunityIdToStartDate.get(enrollment.opportunityId);
    if (date) {
      const diff = getDifferenceInMonths(date);
      if (diff < 6) {
        enrollments[diff]++;
      }
    }
  });
  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main" style={{ maxWidth: '100px' }}>
          <Typography variant="h4" align="center" margin="2rem">
            Reports
          </Typography>
          <Typography variant="h5" align="center">
            Volunteer Statistics
          </Typography>
          <Grid
            container
            spacing={2}
            maxWidth="80vw"
            display="flex"
            justifyContent="center"
          >
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
            <Grid item xs={12} md={4}>
              <Pie
                data={{
                  labels: Array.from(preferences.keys()).map(formatEnum),
                  datasets: [
                    {
                      label: '# Volunteers',
                      data: Array.from(preferences.values()),
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
                title="By Preferences"
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'By Preferences',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h5" align="center" margin="2rem">
            Opportunities Statistics
          </Typography>
          <Grid
            container
            spacing={2}
            maxWidth="80vw"
            display="flex"
            justifyContent="center"
            marginBottom="2rem"
          >
            <Grid item xs={12} md={6}>
              <Line
                id="1231"
                data={{
                  labels: getPastNMonths(6),
                  datasets: [
                    {
                      label: '# Opportunities',
                      data: opportunities,
                      fill: false,
                      backgroundColor: 'rgba(255, 159, 64, 0.2)',
                      borderColor: 'rgba(255, 159, 64, 0.2)',
                      borderWidth: 1,
                    },
                  ],
                }}
                title="Opportunities"
                options={{
                  scales: {
                    y: {
                      suggestedMin: 0,
                      suggestedMax: 100,
                    },
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: 'Opportunities in the Past 6 Months',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Line
                data={{
                  labels: getPastNMonths(6),
                  datasets: [
                    {
                      label: '# Attendance',
                      data: enrollments,
                      fill: false,
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 0.2)',
                      borderWidth: 1,
                    },
                  ],
                }}
                title="Enrollments"
                options={{
                  scales: {
                    y: {
                      suggestedMin: 0,
                      suggestedMax: 100,
                    },
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: 'Attendance for the Past 6 Months',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          {/* <pre>{JSON.stringify(data?.data, null, 2)}</pre> */}
        </div>
      </div>
    </>
  );
}
