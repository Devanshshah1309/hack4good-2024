import CssBaseline from "@mui/material/CssBaseline"; // must always be imported before Box
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
// import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ThemeProvider } from "@emotion/react";
import theme from "../Theme";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HistoryIcon from "@mui/icons-material/History";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { SignOutButton } from "@clerk/clerk-react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { RoutePath } from "../constants";

const drawerWidth = 240;

// const endpoints = new Map([
//   ["Create Profile", "/profile/create"],
//   ["Opportunities", "/opportunities"],
//   ["Volunteering History", "/history"],
//   ["Personal Details", "/profile"],
// ]);

export default function Sidebar() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#F5EEE6",
              // justifyContent: "center",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
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
            <ListItem disablePadding>
              <Link to={RoutePath.DASHBOARD} className="sidebar-link">
                <ListItemButton>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Volunteering History" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to="/opportunities" className="sidebar-link">
                <ListItemButton>
                  <ListItemIcon>
                    <VolunteerActivismIcon />
                  </ListItemIcon>
                  <ListItemText primary="Opportunities" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to={RoutePath.PROFILE} className="sidebar-link">
                <ListItemButton>
                  <ListItemIcon>
                    <AccountBoxIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Account" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <SignOutButton>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log out" />
                </ListItemButton>
              </SignOutButton>
            </ListItem>
          </List>
          {/* <Divider /> */}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
