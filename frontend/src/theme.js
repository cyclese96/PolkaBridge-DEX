import { createMuiTheme } from "@material-ui/core/styles";
export const theme = createMuiTheme({
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      paper: "#fff",
      default: "#fafafa",
      dark: "#070F23",
      ligthDark: "#121827",
    },
    primary: {
      light: "rgba(89, 210, 188, 1)",
      main: "#674293",
    },
    red: {
      red100: "#FFFDFE",
      red200: "#070F23", //#ffc2a8
      red300: "#252E44",
      red500: "#e0077d", // #d16c00
    },
    textColors: {
      primary: "#E0077D",
      secondary: "#E0077D",
      textPrimary: "#ffffff",
      textSecondary: "#1e1e1e",
      textLight: "#212121",
      textDark: "#e5e5e5",
    },
  },
});
export default theme;
