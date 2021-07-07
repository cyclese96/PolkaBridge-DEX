import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    width: 420,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
    },
    // margin: 15,
  },
  heading: {},
  cardsContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "space-evenly",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    height: 300,
  },
  cardP: {
    margin: 0,
    padding: 0,
  },
  cardSpan: {},
  cardSmall: {},
  priceStatBar: {
    marginTop: 20,
    width: "100%",
    height: 45,
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
