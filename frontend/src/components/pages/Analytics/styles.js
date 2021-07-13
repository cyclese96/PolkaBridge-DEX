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
    width: 450,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 370,
    },
    // margin: 15,
  },
  heading: {},
  cardsContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: 20,
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    // width: "100%",
    alignItems: "start",
    justifyContent: "space-evenly",
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 10,
    height: 300,
    [theme.breakpoints.down("sm")]: {
      marginTop: 15,
    },
  },
  chart: {
    width: 340,
    [theme.breakpoints.down("sm")]: {
      width: 300,
    },
  },
  cardSpan: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
  cardP: {
    margin: 0,
    padding: 0,
    fontSize: 20,
  },
  cardSmall: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
  },
  statsGroup: {
    display: "flex",
    width: "30%",
    justifyContent: "space-evenly",
  },
  statLabel: {
    color: "rgba(255,255,255,0.5)",
  },
  statAmount: {},
  statPercentageGreen: {
    display: "flex",
    justifyContent: "center",
    color: "#4caf50",
  },
  statPercentageRed: {
    display: "flex",
    justifyContent: "center",
    color: "#ff1744",
  },
  arrowIcon: {
    margin: 0,
    padding: 0,
  },
  tokenListHeading: {
    width: "100%",
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 2,
  },
  tokenList: {
    width: "100%",
  },
}));

export default useStyles;
