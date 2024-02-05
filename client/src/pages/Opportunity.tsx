import { useAuth } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authenticatedGet, authenticatedPut } from '../axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { EnrollmentWithVolunteer, Opportunity } from '../../../sharedTypes';
import { QueryKey } from '../constants';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridColumnHeaderParams,
} from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

export default function OpportunityPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { opportunityId } = useParams();

  const { data } = useQuery({
    queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
    queryFn: async () => {
      return await authenticatedGet<{
        opportunity: Opportunity;
        enrollments: EnrollmentWithVolunteer[];
      }>(
        `/admin/opportunities/${opportunityId}`,
        (await getToken()) || '',
        navigate,
      );
    },
  });

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
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'adminApproved',
      headerName: 'Approved?',
      width: 150,
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
      headerName: 'Mark Attendance',
      width: 150,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
  ];

  const queryClient = useQueryClient();

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <h2>Opportunity</h2>
        {data && (
          <DataGrid
            rows={rows || []}
            columns={cols}
            autoHeight
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
        <pre>{data && JSON.stringify(data.data, undefined, 2)}</pre>
        {data &&
          data.data.enrollments.map((enrollment) => (
            <div
              key={enrollment.volunteerId}
              style={{ border: '1px solid black' }}
            >
              <p>
                {enrollment.volunteer.firstName} {enrollment.volunteer.lastName}
              </p>
              <p>{enrollment.volunteer.user.email}</p>
              <p>
                adminApproved:
                {String(enrollment.adminApproved)}
              </p>
              <p>
                didAttend:
                {String(enrollment.didAttend)}
              </p>
              <button
                onClick={async () => {
                  await authenticatedPut(
                    `/admin/opportunities/${enrollment.opportunityId}/enrollments/${enrollment.volunteerId}/approval`,
                    { adminApproved: !enrollment.adminApproved },
                    (await getToken()) || '',
                  );
                  queryClient.invalidateQueries({
                    queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
                  });
                }}
              >
                approve/unapprove
              </button>
              <button
                onClick={async () => {
                  await authenticatedPut(
                    `/admin/opportunities/${enrollment.opportunityId}/enrollments/${enrollment.volunteerId}/attendance`,
                    { didAttend: !enrollment.didAttend },
                    (await getToken()) || '',
                  );
                  queryClient.invalidateQueries({
                    queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
                  });
                }}
              >
                mark attendance
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
