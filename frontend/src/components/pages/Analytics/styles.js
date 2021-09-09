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
    height: "100%",
    border: "1px solid #616161",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,

    [theme.breakpoints.down("sm")]: {
      width: 280,
      height: "100%",
    },
  },
  chart: {
    width: 440,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  heading: {
    color: "#bdbdbd",
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
    color: "#757575",
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0.8,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  cardP: {
    margin: 0,
    padding: 0,
    paddingTop: 5,
    fontSize: 26,
    fontWeight: 600,
    color: "#eeeeee",
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
      paddingTop: 0,
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
    height: 55,
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    borderRadius: 15,
    border: "1px solid #616161",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
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
    width: "30%",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      width: "100%",
      justifyContent: "center",
    },
  },
  statLabel: {
    paddingRight: 10,
    color: "rgba(255,255,255,0.5)",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  statAmount: {
    color: "#bdbdbd",
    paddingRight: 5,
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
  // statPercentageGreen: {
  //   display: "flex",
  //   justifyContent: "center",
  //   color: "#4caf50",
  // },
  // statPercentageRed: {
  //   display: "flex",
  //   justifyContent: "center",
  //   color: "#ff1744",
  // },
  // arrowIcon: {
  //   margin: 0,
  //   padding: 0,
  // },
  tokenListHeading: {
    width: "100%",
    color: "#bdbdbd",
    marginTop: 35,
    marginBottom: 10,
    marginLeft: 2,
    fontWeight: 500,
    letterSpacing: 0.7,
  },
  tokenList: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: 240,
    },
  },
}));

export default useStyles;
