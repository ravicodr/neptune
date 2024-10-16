// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // customize the primary color
    },
    secondary: {
      main: "#dc004e", // customize the secondary color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "2px solid #1976d2",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .Mui-focused": {
            color: "#1976d2",
          },
        },
      },
    },
  },
});

export default theme;
