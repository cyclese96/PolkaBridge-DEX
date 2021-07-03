import { CircularProgress, makeStyles } from "@material-ui/core";
import supply from "../../assets/supply.png";
import { fromWei, formatCurrency } from "../../utils/helper";
import biteImg from "../../assets/bite.png";
import corgibImg from "../../assets/corgi.png";
import pwarImg from "../../assets/pwar.png";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 400,
    height: 300,
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
      height: 280,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
    paddingTop: 8,
  },
  avatar: {
    zIndex: 2,
    position: "relative",
    width: "auto",
    height: 60,
  },
  avatar_corgib: {
    zIndex: 2,
    width: "auto",
    height: 160,
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: 400,
    padding: 0,
    margin: 0,
    marginTop: 10,
  },

  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
}));

const Balance = ({ account: { balance, loading }, tokenType }) => {
  const classes = useStyles();

  const tokenLogo = {
    PBR: supply,
    BITE: biteImg,
    CORGIB: corgibImg,
    PWAR: pwarImg,
  };

  return (
    <div className={classes.card}>
      <div className="card-theme">
        <div className={classes.cardContents}>
          {loading[tokenType] ? (
            <CircularProgress className={classes.numbers} />
          ) : (
            <>
              <p className={classes.cardHeading}>Balance</p>
              <img
                className={
                  tokenType === "CORGIB"
                    ? classes.avatar_corgib
                    : classes.avatar
                }
                src={tokenLogo[tokenType]}
              />
              <h4 className={classes.numbers}>
                {tokenType === "PWAR"
                  ? formatCurrency(fromWei(balance[tokenType]), false, 1, true)
                  : formatCurrency(fromWei(balance[tokenType]))}
                {tokenType}
              </h4>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(Balance);
