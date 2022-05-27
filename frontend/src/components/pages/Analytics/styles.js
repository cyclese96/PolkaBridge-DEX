import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 470,
    minHeight: 300,
    height: "100%",

    // background: `linear-gradient(to bottom,#ffffff,#f9f9f9)`,
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,

    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,

    [theme.breakpoints.down("sm")]: {
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 15,
      paddingBottom: 15,
      width: "95vw",
      maxWidth: "100%",
      height: "100%",
    },
  },
  chart: {
    width: 440,
    height: 260,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  heading: {
    color: theme.palette.textColors.heading,

    textAlign: "left",
    fontWeight: 500,
    fontSize: 22,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
      textAlign: "center",
    },
  },
  cardsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "start",

    padding: 20,
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },

  cardSpan: {
    color: theme.palette.textColors.heading,
    fontSize: 15,
    paddingLeft: 7,
    fontWeight: 400,
    letterSpacing: -0.5,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  cardP: {
    margin: 0,
    padding: 0,
    paddingTop: 5,
    paddingLeft: 7,
    fontSize: 22,
    fontWeight: 400,

    color: theme.palette.textColors.subheading,
    letterSpacing: -0.5,
    [theme.breakpoints.down("sm")]: {
      fontSize: 22,
      fontWeight: 600,
      paddingTop: 5,
    },
  },

  priceStatBar: {
    marginTop: 20,
    width: "100%",
    height: 45,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  priceStatContainer: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",

    height: "100%",

    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,

    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    paddingBottom: 15,

    [theme.breakpoints.down("sm")]: {
      height: "100%",
      marginTop: 30,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  statsGroup: {
    display: "flex",
    flexDirection: "row",
    width: "30%",
    justifyContent: "center",
    paddingBottom: 10,
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  },
  priceGroup: {
    display: "flex",
    width: "30%",
    justifyContent: "flex-start",
    paddingBottom: 10,
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
      width: "100%",
    },
  },
  statLabel: {
    paddingRight: 10,
    fontSize: 15,
    color: theme.palette.textColors.heading,

    fontWeight: 500,

    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      paddingRight: 5,
    },
  },
  statAmount: {
    color: theme.palette.textColors.subheading,
    paddingRight: 5,
    fontSize: 14,
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      fontWeight: 500,
    },
  },

  tokenListHeading: {
    width: "100%",
    color: theme.palette.textColors.heading,
    marginTop: 30,
    marginBottom: 10,
    paddingLeft: 2,
    fontWeight: 500,
    letterSpacing: 0.7,
    fontSize: 18,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 10,
    },
  },
  tokenList: {
    width: "100%",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  viewAll: {
    color: "#bdbdbd",
    marginTop: 35,
    marginBottom: 10,
    paddingLeft: 2,
    fontWeight: 500,
    letterSpacing: 0.7,
    fontSize: 18,
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 10,
    },
  },
}));

export default useStyles;
