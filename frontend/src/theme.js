import { createTheme } from "@mui/material/styles";

// white surfaces with blue buttons/accents
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f93ff",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#5a5a72",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto","Segoe UI","Helvetica","Arial",sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: "default",
        elevation: 1,
      },
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
  },
});

export default theme;
