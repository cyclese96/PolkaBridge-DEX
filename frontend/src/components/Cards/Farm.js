import Navbar from "../common/Navbar";
import {
  Button,
  Card,
  Divider,
  makeStyles,
  TextField,
} from "@material-ui/core";

import Wallet from "../common/Wallet";

import Varified from "../../assets/check.png";
import Link from "../../assets/link.png";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    minHeight: 421,
    width: 370,
    borderRadius: 30,
    backgroundColor: "rgba(50, 50, 50, .20)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    border: "1px solid #212121",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: "100%",
      height: "100%",
    },
  },
  cardHeader: {
    paddingTop: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
  avatar: {
    height: "35px",
  },
  cardHeading: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 14,
    alignSelf: "start",
    marginLeft: 60,
    margin: 0,
  },

  buttons: {
    marginTop: 20,
    marginBottom: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  hint: {
    paddingTop: 4,
    fontSize: 10,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
  },
  bitePool: {
    marginBottom: 20,
    alignSelf: "start",
  },
  poolItemText: {
    fontSize: 12,
    marginLeft: 60,
    margin: 0,
    marginTop: 2,
  },
  stakeButtons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap-reverse",
  },
  stakeButton: {
    marginTop: 5,
    alignSelf: "center",
    justifySelf: "center",
  },
  logoWrapper: {
    height: 45,
    width: 45,
    backgroundColor: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 16,
    paddingBottom: 3,
    color: "#e5e5e5",
  },
  tokenTitleContract: {
    fontWeight: 500,
    fontSize: 16,
    color: "#e5e5e5",
  },
  tokenTitleTvl: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 600,
    color: "#e5e5e5",
    // backgroundColor: "#C80C81",
    border: "1px solid rgba(224, 7, 125, 0.6)",

    borderRadius: 14,
  },
  tokenSubtitle: {
    fontWeight: 300,
    padding: 0,
    paddingLeft: 10,
    fontSize: 12,
    color: "#bdbdbd",
  },
  tokenAmount: {
    fontWeight: 700,
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: "#C80C81",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenAmountTvl: {
    fontWeight: 700,
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: "#e5e5e5",
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 12,
    [theme.breakpoints.down("sm")]: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
  },
  earn: {
    textAlign: "center",
    color: "#bdbdbd",
    fontSize: 15,
    fontWeight: 600,
    border: "1px solid #C80C81",
    borderRadius: 30,
    height: 40,
    width: 110,
    paddingTop: 8,
  },
  farmName: {
    textAlign: "center",
    color: "#bdbdbd",
    fontSize: 15,
    fontWeight: 600,
  },
  desktop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
  },
  borderButton: {
    background: `transparent`,
    color: "white",
    width: "fit-content",
    height: 32,
    textTransform: "none",
    borderRadius: 30,
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    border: "1px solid rgba(224, 7, 125, 0.3)",
    padding: "5px 20px 5px 20px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      fontSize: 13,
    },
  },
  tagWrapper: {
    padding: 10,
  },
  imgWrapper: {
    padding: 15,
  },
  tokenTitleText: {
    float: "right",
  },
  tokenTitleDi: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 18,
    fontSize: 16,
    color: "#e5e5e5",
    paddingTop: 10,
  },
  tokenAmountDi: {
    fontWeight: 700,
    padding: 0,
    paddingRight: 10,
    paddingTop: 10,
    fontSize: 18,
    color: "#C80C81",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContract: {
    background: "linear-gradient(to right, #C80C81,purple)",
    color: "white",
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    fontWeight: 500,
    letterSpacing: 0.4,
    textTransform: "none",
    filter: "drop-shadow(0 0 0.5rem #414141)",
    "&:hover": {
      background: "#C80C81",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginLeft: 15,
      width: 150,
    },
  },
  textField: {
    border: "1px solid white",
    borderRadius: 30,
    marginTop: 10,
    outlinedRoot: {
      "&:hover": {
        border: "1px solid red",
      },
    },
  },
  contractButton: {
    fontSize: 15,
    color: "white",
  },
  harvestButton: {
    background: "linear-gradient(to right, #C80C81,purple)",
    color: "white",
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    fontWeight: 500,
    letterSpacing: 0.4,
    textTransform: "none",
    width: 150,
    filter: "drop-shadow(0 0 0.5rem #414141)",
    marginLeft: 20,
    "&:hover": {
      background: "#C80C81",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginLeft: 15,
      width: 150,
    },
  },
}));
function Farm() {
  const classes = useStyles();
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <Card elevation={10} className={classes.card}>
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-between align-items-center pt-2 pb-1">
            <div className={classes.imgWrapper}>
              <img
                className={classes.avatar}
                src={
                  "https://vampireswap.org/_next/image?url=https%3A%2F%2Fraw.githubusercontent.com%2Fvampireswap%2Ftokens%2Fmaster%2Fblockchains%2Ffantom%2Fassets%2F0x74b23882a30290451A17c44f4F05243b6b58C76d%2Flogo.png&w=48&q=50"
                }
              />
              <img
                className={classes.avatar}
                src={
                  "https://vampireswap.org/_next/image?url=https%3A%2F%2Fraw.githubusercontent.com%2Fvampireswap%2Ftokens%2Fmaster%2Fblockchains%2Ffantom%2Fassets%2F0x321162Cd933E2Be498Cd2267a90534A804051b11%2Flogo.png&w=48&q=50"
                }
              ></img>
            </div>
            <div className={classes.tagWrapper}>
              {/* <div className={classes.earn}>ETH-USDT</div> */}
              <div className={classes.earn}>
                <img
                  style={{ height: 20, width: 20, marginRight: 5 }}
                  src={Varified}
                />
                Core 40X
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center ">
            <div
              style={{
                backgroundColor: "#C80C81",
                borderRadius: "50%",
                height: "5px",
                width: "5px",
                marginRight: 5,
              }}
            ></div>
            <div className={classes.farmName}>ETH-USDT</div>
          </div>
          <div style={{ minHeight: 120, paddingLeft: 10, paddingRight: 10 }}>
            <div className="mt-3">
              <div className="d-flex justify-content-between mt-1">
                <div className="d-flex justify-content-start">
                  <div>
                    <div className={classes.tokenTitle}>APR</div>
                  </div>
                </div>
                <div className={classes.tokenAmount}>43404%</div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div className="d-flex justify-content-start">
                  <div>
                    <div className={classes.tokenTitle}>EARN</div>
                  </div>
                </div>
                <div className={classes.tokenAmount}>PBR</div>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div className="d-flex justify-content-start">
                  <div>
                    <div className={classes.tokenTitle}>PBR EARNED</div>
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <div>
                  <input
                    style={{
                      width: "50%",
                      height: 40,
                      padding: "12px 20px",
                      margin: "8px 0",
                      boxSizing: "border-box",
                      border: "1px solid grey",
                      borderRadius: 30,
                      outline: "none",
                      backgroundColor: "transparent",
                    }}
                  />
                  <button className={classes.harvestButton}>Harvest</button>
                </div>
              </div>

              {/* <div className="d-flex justify-content-between mt-2">
                <div className="d-flex justify-content-start">
                  <div>
                    <div className={classes.tokenTitle}>PBR-USDT LP STAKED</div>
                  </div>
                </div>
              </div> */}
              {/* <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    Staked LP
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                />
              </div> */}

              <div className="d-flex justify-content-center my-4">
                <div>
                  <h1 className={classes.tokenTitleContract}>
                    PBR-ETH LP STAKED
                  </h1>
                  <Button className={classes.buttonContract}>
                    Enable Contract
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Divider style={{ backgroundColor: "#616161", height: 1 }} />
          <div className="d-flex justify-content-between mt-1">
            <div className="d-flex justify-content-start">
              <div>
                <div className={classes.tokenTitleDi}>Total Liquidity</div>
              </div>
            </div>
            <div className={classes.tokenAmountDi}>$428,813,040</div>
          </div>
          <div className={classes.desktop}>
            <div className="text-center mt-2">
              <div className={classes.tokenTitle}>
                Get ETH-USDT LP{" "}
                <img
                  style={{ height: 20, width: 20, marginRight: 5 }}
                  src={Link}
                />
              </div>
            </div>

            <div className="text-center mt-2">
              <div className={classes.tokenTitle}>
                View Contract{" "}
                <img
                  style={{ height: 20, width: 20, marginRight: 5 }}
                  src={Link}
                />
              </div>
            </div>
            <div className="text-center mt-2">
              <div className={classes.tokenTitle}>
                See Pair Info{" "}
                <img
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 5,
                  }}
                  src={Link}
                />
              </div>
            </div>
          </div>

          <div className={classes.buttons}>
            <div className="text-center">
              <Wallet />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Farm;
