import { createMuiTheme } from "@mui/material/styles";

export const theme = createMuiTheme({
  palette: {
    action: {
      disabled: "#919191",
      disabledBackground: "rgb(237, 238, 242)",
    },
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

    red: {
      red100: "#FFFDFE",
      red200: "#070F23", //#ffc2a8
      red300: "#252E44",
      red500: "#e0077d", // #d16c00
    },
    textColors: {
      heading: "#000000",
      subheading: "#454545",
      light: "#bdbdbd",
      pbr: "rgba(89, 210, 188, 1)",
      secondary: "#E0077D",
      textPrimary: "#ffffff",
      textSecondary: "#1e1e1e",
      textLight: "#212121",
      textDark: "#e5e5e5",
    },
    primary: {
      pbr: "#E32687",
      iconBack: "rgb(237, 238, 242)",
      iconColor: "#212121",
      appLink: "#212121",
      bgCard: "#ffffff",
      buttonText: "#ffffff",
      light: "rgba(89, 210, 188, 1)",
      main: "#674293",
    },
  },
});
export default theme;
