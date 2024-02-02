// Theme.js

import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundColor: "#FFF8E3", // Set your default background color
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#12aa12", // Set your primary color
    },
    secondary: {
      main: "#aa12aa", // Set your secondary color
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif", // Set your preferred font family
  },
});

export default theme;
