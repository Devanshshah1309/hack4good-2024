import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
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
import { SignOutButton } from "@clerk/clerk-react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const endpoints = ["/opportunities", "/history", "/profile"];

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
            {["Opportunities", "Volunteering History", "Personal Details"].map(
              (text, index) => (
                <ListItem key={text} disablePadding>
                  <Link to={endpoints[index]}>
                    <ListItemButton>
                      <ListItemIcon>
                        {index === 0 ? (
                          <VolunteerActivismIcon />
                        ) : index === 1 ? (
                          <HistoryIcon />
                        ) : (
                          <AccountBoxIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              )
            )}
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
