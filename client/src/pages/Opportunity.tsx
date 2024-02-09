import { useAuth } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authenticatedGet,
  authenticatedPut,
  authenticatedDelete,
} from '../axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  EnrollmentWithVolunteer,
  Opportunity,
  SwapDatesWithStrings,
} from '../../../server/src/types';
import { QueryKey } from '../constants';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridColumnHeaderParams,
  GridToolbar,
} from '@mui/x-data-grid';
import { Button, Snackbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { extractDateAndTime, renderCellExpand } from '../utils';
import { useState } from 'react';

export default function OpportunityPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { opportunityId } = useParams();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { data } = useQuery({
    queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
    queryFn: async () => {
      return await authenticatedGet<{
        opportunity: SwapDatesWithStrings<Opportunity>;
        enrollments: EnrollmentWithVolunteer[];
      }>(
        `/admin/opportunities/${opportunityId}`,
        (await getToken()) || '',
        navigate,
      );
    },
  });

  const start = extractDateAndTime(data?.data.opportunity.start);
  const end = extractDateAndTime(data?.data.opportunity.end);

  const rows: GridRowsProp = data?.data.enrollments.map((enrollment) => {
    return {
      id: enrollment.volunteerId,
      firstName: enrollment.volunteer.firstName,
      lastName: enrollment.volunteer.lastName,
      gender: enrollment.volunteer.gender,
      phone: enrollment.volunteer.phone,
      email: enrollment.volunteer.user.email,
      adminApproved: enrollment.adminApproved,
      didAttend: enrollment.didAttend,
    };
  });

  const COLUMN_HEADER_CLASSNAME: string = 'data-grid-header';
  const COLUMN_RENDER_HEADER = (params: GridColumnHeaderParams) => {
    return (
      <Typography variant="body1" fontWeight="bold">
        {params.colDef.headerName}
      </Typography>
    );
  };

  const cols: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'adminApproved',
      headerName: 'Approved',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: (params) => {
        const onClick = async (e) => {
          e.stopPropagation();
          const volunteerId = params.row.id;
          const enrollment = data?.data.enrollments.find(
            (enrollment) => enrollment.volunteerId === volunteerId,
          );
          if (enrollment) {
            await authenticatedPut(
              `/admin/opportunities/${enrollment.opportunityId}/enrollments/${enrollment.volunteerId}/approval`,
              { adminApproved: !enrollment.adminApproved },
              (await getToken()) || '',
            );
            queryClient.invalidateQueries({
              queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
            });
          }
        };
        return (
          <Button
            onClick={onClick}
            color={params.value ? 'success' : 'error'}
            style={{
              border: 'none',
              borderRadius: '5px',
              padding: '5px',
              cursor: 'pointer',
            }}
          >
            {params.value ? <DoneIcon /> : <CloseIcon />}
          </Button>
        );
      },
    },
    {
      field: 'didAttend',
      headerName: 'Attendance',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: (params) => {
        const onClick = async (e) => {
          e.stopPropagation();
          const volunteerId = params.row.id;
          const enrollment = data?.data.enrollments.find(
            (enrollment) => enrollment.volunteerId === volunteerId,
          );
          if (enrollment) {
            await authenticatedPut(
              `/admin/opportunities/${enrollment.opportunityId}/enrollments/${enrollment.volunteerId}/attendance`,
              { didAttend: !enrollment.didAttend },
              (await getToken()) || '',
            );
            queryClient.invalidateQueries({
              queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
            });
          }
        };
        if (params.row.adminApproved === false) return '';
        return (
          <Button
            onClick={onClick}
            color={params.value ? 'success' : 'error'}
            style={{
              border: 'none',
              borderRadius: '5px',
              padding: '5px',
              cursor: 'pointer',
            }}
          >
            {params.value ? <DoneIcon /> : <CloseIcon />}
          </Button>
        );
      },
    },
  ];

  const queryClient = useQueryClient();

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <Typography variant="h4" align="center" paddingTop="2rem">
          Opportunity Details
        </Typography>
        {data && (
          <>
            {data && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color="warning"
                  variant="contained"
                  style={{ margin: '1rem' }}
                  onClick={async () => {
                    await authenticatedPut(
                      `/admin/opportunities/${opportunityId}`,
                      {
                        ...data.data.opportunity,
                        archive: !data.data.opportunity.archive,
                      },
                      (await getToken()) || '',
                    );
                    queryClient.invalidateQueries({
                      queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
                    });
                    setShowSnackbar(true);
                  }}
                >
                  Archive Opportunity
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  style={{ margin: '1rem' }}
                  onClick={async () => {
                    await authenticatedDelete(
                      `/admin/opportunities/${opportunityId}`,
                      (await getToken()) || '',
                    );
                    navigate('/opportunities');
                  }}
                >
                  Delete Opportunity
                </Button>
              </div>
            )}
            <Typography variant="h6">
              Name: {data.data.opportunity.name}
            </Typography>
            <Typography variant="subtitle1">
              Description: {data.data.opportunity.description}
            </Typography>
            <Typography variant="subtitle1">
              Location: {data.data.opportunity.location}
            </Typography>
            <Typography variant="subtitle1">
              Start: {start.dateString} {start.timeString}
            </Typography>
            <Typography variant="subtitle1">
              End: {end.dateString} {end.timeString}
            </Typography>
            <Typography variant="subtitle1">
              Volunteering Hours: {data.data.opportunity.durationMinutes / 60}
            </Typography>
          </>
        )}
        <Typography variant="h5" align="center" paddingTop="2rem">
          Volunteer Enrollments
        </Typography>
        {data && (
          <DataGrid
            rows={rows || []}
            columns={cols}
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowClassName={(params) => {
              return params.indexRelativeToCurrentPage % 2 === 0
                ? 'row-even'
                : 'row-odd';
            }}
            sx={{ maxWidth: '80vw', boxShadow: 2, border: 2 }}
          />
        )}
        <Snackbar
          open={showSnackbar}
          ContentProps={{
            style: {
              backgroundColor: '#2E7D32',
            },
          }}
          autoHideDuration={3000}
          message="Opportunity archived successfully!"
          onClose={() => {
            setShowSnackbar(false);
          }}
        />
      </div>
    </div>
  );
}
