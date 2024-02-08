import { useAuth } from '@clerk/clerk-react';
import { Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import {
  GridRowsProp,
  GridColumnHeaderParams,
  GridColDef,
  GridRenderCellParams,
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { AdminGetVolunteer } from '../../../sharedTypes';
import { authenticatedGet } from '../axios';
import { extractDateAndTime } from '../utils';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';

export default function History() {
  const { userId, getToken } = useAuth();
  const queryKey = 'volunteer';
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      authenticatedGet<AdminGetVolunteer>(
        `/admin/volunteers/${userId}`,
        (await getToken()) || '',
        navigate,
      ),
  });
  const content = data && data?.data;
  if (!content) return 'Loading...';
  const attendedOpportunities = content.enrollments.filter(
    (opp) => opp.didAttend,
  );
  const rows: GridRowsProp = attendedOpportunities.map((enrollment) => {
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

  let totalHoursVolunteered = 0;
  attendedOpportunities.forEach((enrollment) => {
    totalHoursVolunteered += enrollment.opportunity.durationMinutes;
  });
  totalHoursVolunteered = totalHoursVolunteered / 60;

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
      field: 'download',
      headerName: 'Download Certificate',
      width: 200,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return <DownloadIcon />;
      },
    },
    {
      field: 'opportunity',
      headerName: 'Opportunity',
      width: 200,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'start',
      headerName: 'Start',
      width: 200,
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
      width: 200,
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
      width: 200,
      renderHeader: COLUMN_RENDER_HEADER,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderCell: (params: GridRenderCellParams) => {
        return params.value / 60;
      },
      align: 'center',
      headerAlign: 'center',
    },
  ];
  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <Typography variant="h4" align="center" margin="2rem">
            Volunteering History
          </Typography>
          {content && (
            <>
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
                sx={{
                  maxWidth: '80vw',
                  boxShadow: 2,
                  border: 2,
                }}
              />
              <Typography variant="h6" align="center" margin="2rem">
                Total Volunteering Hours: {totalHoursVolunteered}
              </Typography>
            </>
          )}
        </div>
      </div>
    </>
  );
}
