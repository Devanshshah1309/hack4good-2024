import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticatedGet } from '../axios';
import { useAuth } from '@clerk/clerk-react';
import useUserRole from '../hooks/useUserRole';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import { AdminGetVolunteers } from '../../../server/src/types';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridColumnHeaderParams,
  GridToolbar,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { RESIDENTIAL_STATUS_MAP, RoutePath } from '../constants';
import { Typography } from '@mui/material';
import { formatEnum, renderCellExpand } from '../utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function Volunteers() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const queryKey = 'volunteers';
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      authenticatedGet<AdminGetVolunteers[]>(
        '/admin/volunteers',
        (await getToken()) || '',
        navigate,
      ),
  });
  useEffect(() => {
    if (role !== 'ADMIN') navigate(RoutePath.OPPORTUNITIES);
  }, [role, navigate]);
  let content: AdminGetVolunteers[] = [];
  if (data) content = data.data;

  const rows: GridRowsProp = content.map((user) => {
    return {
      id: user.clerkUserId,
      firstName: user.volunteer.firstName,
      lastName: user.volunteer.lastName,
      email: user.email,
      phone: user.volunteer.phone,
      residentialStatus:
        RESIDENTIAL_STATUS_MAP[user.volunteer.residentialStatus],
      address: user.volunteer.address,
      gender: user.volunteer.gender === 'M' ? 'Male' : 'Female',
      skills: user.volunteer.skills,
      experience: user.volunteer.experience,
      dateOfBirth: user.volunteer.dateOfBirth,
      occupation: user.volunteer.occupation,
      driving: user.volunteer.driving,
      vehicle: user.volunteer.ownsVehicle,
      education: user.volunteer.educationBackground,
      school: user.volunteer.school,
      commitmentLevel: user.volunteer.commitmentLevel,
      preferences: user.volunteer.VolunteerPreference.map((pref) => {
        return formatEnum(pref.preference);
      }).join(', '),
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
      field: 'Actions',
      headerName: 'Actions',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <VisibilityIcon
            sx={{ display: 'block', margin: 'auto' }}
            onClick={() => {
              navigation;
              navigate(`${RoutePath.VOLUNTEERS}/${params.row.id}`, {
                state: { userId: params.row.id },
              });
            }}
            style={{ cursor: 'pointer' }}
          />
        );
      },
    },
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
      headerName: 'Phone Number',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'residentialStatus',
      headerName: 'Residential Status',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      align: 'center',
      width: 200,
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: (params) => {
        return new Date(params.value as string).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      field: 'occupation',
      headerName: 'Occupation',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'driving',
      headerName: 'Can Drive',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: (params) => {
        return params.value ? (
          <CheckIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        );
      },
    },
    {
      field: 'vehicle',
      headerName: 'Owns Vehicle',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: (params) => {
        return params.value ? (
          <CheckIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        );
      },
    },
    {
      field: 'education',
      headerName: 'Education',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'school',
      headerName: 'School',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'commitmentLevel',
      headerName: 'Commitment Level',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'skills',
      headerName: 'Skills',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'experience',
      headerName: 'Experience',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'preferences',
      headerName: 'Preferences',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
  ];
  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <Typography variant="h4" align="center" margin="2rem">
          Volunteers
        </Typography>
        <div style={{ width: '100%', maxHeight: '80vh' }}>
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
        </div>
        {/* <pre>response data: {JSON.stringify(content, undefined, 2)}</pre> */}
      </div>
    </div>
  );
}
