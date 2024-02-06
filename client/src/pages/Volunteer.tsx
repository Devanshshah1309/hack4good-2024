import React, { useEffect } from 'react';
import useUserRole from '../hooks/useUserRole';
import { AdminGetVolunteer } from '../../../sharedTypes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authenticatedGet } from '../axios';
import { RoutePath } from '../constants';
import { useAuth } from '@clerk/clerk-react';
import Sidebar from '../components/Sidebar';
import { Typography } from '@mui/material';
import VolunteerProfile from '../components/VolunteerProfile';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { extractDateAndTime } from '../utils';

export default function Volunteer() {
  const { role } = useUserRole();
  const { userId } = useAuth();
  const queryKey = 'volunteer';
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      authenticatedGet<AdminGetVolunteer>(
        `/admin/volunteers/${params.volunteerId}`,
        (await getToken()) || '',
        navigate,
      ),
  });
  useEffect(() => {
    if (role !== 'ADMIN' && userId !== params.volunteerId)
      navigate(RoutePath.OPPORTUNITIES);
  }, [role, navigate]);
  const content = data && data?.data;

  const rows: GridRowsProp = content?.enrollments.map((enrollment) => {
    return {
      id: enrollment.opportunityId,
      opportunity: enrollment.opportunity.name,
      start: enrollment.opportunity.start,
      end: enrollment.opportunity.end,
      duration: enrollment.opportunity.durationMinutes,
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
      field: 'opportunity',
      headerName: 'Opportunity',
      flex: 1,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'start',
      headerName: 'Start',
      flex: 1,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderCell: (params: GridRenderCellParams) => {
        const datetime = extractDateAndTime(params.value);
        return `${datetime.dateString} ${datetime.timeString}`;
      },
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'end',
      headerName: 'End',
      flex: 1,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderCell: (params: GridRenderCellParams) => {
        const datetime = extractDateAndTime(params.value);
        return `${datetime.dateString} ${datetime.timeString}`;
      },
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'duration',
      headerName: 'Volunteering Hours',
      flex: 1,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderCell: (params: GridRenderCellParams) => {
        return params.value / 60;
      },
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'adminApproved',
      headerName: 'Admin Approved',
      flex: 1,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <DoneIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        );
      },
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'didAttend',
      headerName: 'Attendance',
      flex: 1,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.adminApproved === false) return '';
        return params.value ? (
          <DoneIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        );
      },
      align: 'center',
      headerAlign: 'center',
    },
  ];

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main" style={{ maxWidth: '100px' }}>
        <Typography variant="h4" align="center" margin="2rem">
          Volunteer Profile
        </Typography>
        {content?.volunteer && (
          <VolunteerProfile user={content} shouldAllBeDisabled />
        )}
        <Typography variant="h4" align="center" margin="2rem">
          Volunteering History
        </Typography>
        {content?.enrollments && (
          <DataGrid
            rows={rows}
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
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    </div>
  );
}
