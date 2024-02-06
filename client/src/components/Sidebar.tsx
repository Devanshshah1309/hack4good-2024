import CssBaseline from '@mui/material/CssBaseline'; // must always be imported before Box
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import AppBar from "@mui/material/AppBar";
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@emotion/react';
import theme from '../Theme';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HistoryIcon from '@mui/icons-material/History';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { PLACEHOLDER_IMAGE_URL, RoutePath } from '../constants';
import { useAuth } from '@clerk/clerk-react';
import useUserRole from '../hooks/useUserRole';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import BigAtHeartLogo from '../assets/big-at-heart.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';

const drawerWidth = 240;

// const endpoints = new Map([
//   ["Create Profile", "/profile/create"],
//   ["Opportunities", "/opportunities"],
//   ["Volunteering History", "/history"],
//   ["Personal Details", "/profile"],
// ]);

export default function Sidebar() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { role } = useUserRole();
  const { user } = useUser();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#81c784',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <img src={BigAtHeartLogo} />
          {role === 'ADMIN' && (
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Volunteer Management Portal
            </Typography>
          )}
          {user?.emailAddresses[0].emailAddress && (
            <div style={{ textAlign: 'center' }}>
              <Typography variant="subtitle1">
                {user?.emailAddresses[0].emailAddress}
              </Typography>
              {role === 'ADMIN' && 'Admin Account'}
            </div>
          )}
          <Divider />
          <List>
            {!role && (
              <ListItem disablePadding>
                <Link to={RoutePath.PROFILE_CREATE} className="sidebar-link">
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create Profile" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {isSignedIn && (
              <>
                <ListItem disablePadding>
                  <Link to={RoutePath.DASHBOARD} className="sidebar-link">
                    <ListItemButton>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link to={RoutePath.OPPORTUNITIES} className="sidebar-link">
                    <ListItemButton>
                      <ListItemIcon>
                        <VolunteerActivismIcon />
                      </ListItemIcon>
                      <ListItemText primary="Opportunities" />
                    </ListItemButton>
                  </Link>
                </ListItem>
                {role === 'ADMIN' && (
                  <ListItem disablePadding>
                    <Link to={RoutePath.VOLUNTEERS} className="sidebar-link">
                      <ListItemButton>
                        <ListItemIcon>
                          <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Volunteers" />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                )}
                {role === 'VOLUNTEER' && (
                  <>
                    <ListItem disablePadding>
                      <Link to={RoutePath.HISTORY} className="sidebar-link">
                        <ListItemButton>
                          <ListItemIcon>
                            <HistoryIcon />
                          </ListItemIcon>
                          <ListItemText primary="Volunteering History" />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding>
                      <Link to={RoutePath.PROFILE} className="sidebar-link">
                        <ListItemButton>
                          <ListItemIcon>
                            <AccountBoxIcon />
                          </ListItemIcon>
                          <ListItemText primary="My Profile" />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </>
                )}
                <ListItem disablePadding>
                  <SignOutButton
                    signOutCallback={() => navigate(RoutePath.ROOT)}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Log out" />
                    </ListItemButton>
                  </SignOutButton>
                </ListItem>
              </>
            )}
          </List>
          {/* <Divider /> */}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
