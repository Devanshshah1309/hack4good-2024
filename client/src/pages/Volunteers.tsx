import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticatedGet } from '../axios';
import { useAuth } from '@clerk/clerk-react';
import useUserRole from '../hooks/useUserRole';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import { AdminGetVolunteers } from '../../../sharedTypes';
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
import { renderCellExpand } from '../utils';

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
      residentialStatus:
        RESIDENTIAL_STATUS_MAP[user.volunteer.residentialStatus],
      address: user.volunteer.address,
      gender: user.volunteer.gender,
      skills: user.volunteer.skills,
      experience: user.volunteer.experience,
      dateOfBirth: user.volunteer.dateOfBirth,
      preferences: user.volunteer.preferences,
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
      width: 100,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 100,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'residentialStatus',
      headerName: 'Residential Status',
      width: 200,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      width: 150,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: (params) => {
        return new Date(params.value as string).toLocaleDateString();
      },
    },
    {
      field: 'skills',
      headerName: 'Skills',
      width: 200,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    {
      field: 'experience',
      headerName: 'Experience',
      width: 200,
      headerClassName: COLUMN_HEADER_CLASSNAME,
      renderHeader: COLUMN_RENDER_HEADER,
      renderCell: renderCellExpand,
    },
    // {
    //   field: 'preferences',
    //   headerName: 'Preferences',
    //   width: 200,
    //   headerClassName: COLUMN_HEADER_CLASSNAME,
    //   renderHeader: COLUMN_RENDER_HEADER,
    //   renderCell: renderCellExpand,
    // },
  ];
  console.log(content);
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
        <pre>response data: {JSON.stringify(content, undefined, 2)}</pre>
      </div>
    </div>
  );
}
