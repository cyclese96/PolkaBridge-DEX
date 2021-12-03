import {
  Button,
  Card,
  Divider,
  makeStyles,
} from "@material-ui/core";

import ShowChartIcon from '@material-ui/icons/ShowChart';
import Varified from "../../../assets/check.png";
import { Link } from "react-router-dom";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import TokenIcon from "../../common/TokenIcon";
import { useEffect, useState } from "react";
import StakeDialog from "./StakeDialog";
import { allowanceAmount, farmingPoolConstants } from "../../../constants";
import { connect } from "react-redux";
import { formatCurrency, formattedNum } from "../../../utils/formatters";
import { checkLpFarmAllowance, confirmLpFarmAllowance, getFarmInfo, getLpBalanceFarm } from '../../../actions/farmActions'

const useStyles = makeStyles((theme) => ({
  card: {
    width: 350,
    borderRadius: 15,
    marginTop: 20,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      // width: "90%",
      // maxWidth: 400,
      width: 300,
      border: "1px solid #212121",
      marginLeft: 40,
    },
  },

  cardContents: {},
  avatar: {
    height: "30px",
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
  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 14,
    paddingBottom: 3,
    color: "#b7b7b7",
  },
  tokenValuesZero: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 24,
    paddingBottom: 3,
    color: "#727272",
  },
  tokenValues: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 24,
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
    // padding: 0,
    // paddingLeft: 10,
    marginRight: 5,
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
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid #C80C81",
    borderRadius: 25,
    height: 30,
    width: 90,
    paddingTop: 3,
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
    padding: 8,
  },
  imgWrapper: {
    padding: 15,
  },
  tokenTitleText: {
    float: "right",
  },
  tokenTitleDi: {
    fontWeight: 500,
    fontSize: 16,
    color: "#e5e5e5",
  },
  tokenAmountDi: {
    fontWeight: 700,
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
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    textTransform: "none",
    fontSize: 17,
    width: 110,
    borderRadius: 15,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    padding: "8px 50px 8px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      // width: "80%",
    },
  },
  approveBtn: {
    backgroundColor: "rgba(224, 7, 125, 0.6)",
    color: "white",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 15,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    padding: "8px 50px 8px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      // width: "80%",
    },
  },
  stakeBtn: {
    backgroundColor: "rgba(224, 7, 125, 0.6)",
    color: "white",
    textTransform: "none",
    fontSize: 28,
    borderRadius: 15,
    height: 40,
    width: 50,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    paddingBottom: 10,
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      // width: "80%",
    },
  },
}));

//redux states for testing
const famrs = {
  "PBR-ETH": {
    apr: '200.0',
    earned: '20',
    staked: '100',
    liquidity: '413690675',
    pairAddress: '0x3f5d1EE2391850578712C4473D7b8df5A036C2A4'
  },
  "ETH-USDT": {
    apr: '150',
    earned: '100',
    staked: '20000',
    liquidity: '413690675',
    pairAddress: '0xE3419211dccfb659c6d967a290Fbe5F2eBFA241a'
  }
}

const lpApproved = {
  "PBR-ETH": false,
  "ETH-USDT": true
}


const Farm = (props) => {

  const {
    farmPool,
    account: { currentAccount, currentNetwork },
    farm: { farms, lpApproved },
    getFarmInfo,
    checkLpFarmAllowance,
    confirmLpFarmAllowance,
    getLpBalanceFarm
  } = props;
  const classes = useStyles();

  const [stakeDialogOpen, setStakeDialog] = useState(false);

  useEffect(() => {

    if (!currentAccount || !currentNetwork) {
      return;
    }
    console.log('farmTest fetching data ', { currentAccount, currentNetwork })

    async function loadFarmData() {
      checkLpFarmAllowance(farmPoolAddress(farmPool), currentAccount, currentNetwork);
      getFarmInfo(farmPoolAddress(farmPool), farmPoolId(farmPool), currentAccount, currentNetwork);
      getLpBalanceFarm(farmPoolAddress(farmPool), currentAccount, currentNetwork);
    }
    loadFarmData();

  }, [currentAccount]);


  const farmPoolAddress = (_farmPool) => {
    return farmingPoolConstants?.ethereum?.[_farmPool]?.address;
  }

  const farmPoolId = (_farmPool) => {
    return farmingPoolConstants?.ethereum?.[_farmPool]?.pid;
  }

  const farmData = (_farmPool) => {
    if (!Object.keys(famrs).includes(farmPoolAddress(_farmPool))) {
      return {}
    }
    return farms[farmPoolAddress(_farmPool)];
  }

  const handleApproveLpTokenToFarm = () => {

    confirmLpFarmAllowance(allowanceAmount, farmPoolAddress(farmPool), currentAccount, currentNetwork);

  }

  const handleHarvest = () => {
    //todo:
  }

  const handleStakeActions = (actionType = "stake") => {
    //todo:
    setStakeDialog(true)
  }

  return (
    <Card elevation={10} className={classes.card}>
      <StakeDialog open={stakeDialogOpen} handleClose={() => setStakeDialog(false)} />
      <div className={classes.cardContents}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.imgWrapper}>
            <TokenIcon className={classes.avatar} symbol={farmPool?.split("-")?.[0]} />
            <TokenIcon className={classes.avatar} symbol={farmPool?.split("-")?.[1]} />
          </div>
          <div>
            <div className={classes.farmName}>{farmPool}</div>
            <div className={classes.tagWrapper}>
              {/* <div className={classes.earn}>ETH-USDT</div> */}
              <div className={classes.earn}>
                <img
                  style={{ height: 20, width: 20, marginRight: 5 }}
                  src={Varified}
                />
                Core {farmingPoolConstants?.[currentNetwork]?.[farmPool]?.multiplier}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.tokenTitle}>APR </div>

          <div className="d-flex align-items-center">
            <div className={classes.tokenAmount}>{famrs?.[farmPool]?.apr}% </div>
            <ShowChartIcon className={classes.tokenAmount} fontSize="small" />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.tokenTitle}>EARN</div>
          <div className={classes.tokenAmount}>PBR + Fees </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.tokenTitle}>PBR earned</div>
          <div className={classes.tokenAmount}></div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.tokenValues}>{formattedNum(!farmData(farmPool) ? "0.00" : farmData(farmPool).pendingPbr)}</div>
          <Button
            variant="contained"
            className={classes.harvestButton}
            disabled={true}
          >
            Harvest
          </Button>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className={classes.tokenTitle}>PBR-ETH LP STAKED</div>
          <div className={classes.tokenAmount}></div>
        </div>

        {!lpApproved?.[farmPoolAddress(farmPool)] ? (
          <div className="d-flex justify-content-center align-items-center mt-1">
            <Button onClick={handleApproveLpTokenToFarm} variant="contained" className={classes.approveBtn}>
              Approve LP Tokens
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center mt-1">
            <div className={classes.tokenValues}>{formattedNum(farmData(farmPool)?.stakeData?.amount)}</div>
            <div className="d-flex justify-content-between align-items-center">
              <Button onClick={handleStakeActions} className={classes.stakeBtn} style={{ marginRight: 5 }}>
                +
              </Button>
              <Button onClick={handleStakeActions} className={classes.stakeBtn}>
                -
              </Button>
            </div>
          </div>
        )}

        <div className="mt-3">
          <Divider style={{ backgroundColor: "#616161", height: 1 }} />
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className={classes.tokenTitle}>Total Liquidity:</div>
          <div className={classes.tokenAmount}>$413,690,675</div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-1">
          <Link to="liquidity">
            {" "}
            <div className={classes.tokenTitle}>
              Get PBR-USDT LP <OpenInNewIcon fontSize="small" />{" "}
            </div>{" "}
          </Link>
          <div className={classes.tokenAmount}></div>
        </div>

        <div className="d-flex justify-content-between align-items-center ">
          <Link to="liquidity">
            {" "}
            <div className={classes.tokenTitle}>
              View Contract <OpenInNewIcon fontSize="small" />{" "}
            </div>{" "}
          </Link>
          <div className={classes.tokenAmount}></div>
        </div>

        <div className="d-flex justify-content-between align-items-center ">
          <Link to="liquidity">
            {" "}
            <div className={classes.tokenTitle}>
              See Pair Info <OpenInNewIcon fontSize="small" />{" "}
            </div>{" "}
          </Link>
          <div className={classes.tokenAmount}></div>
        </div>
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => ({
  account: state.account,
  farm: state.farm
})

export default connect(mapStateToProps, { getFarmInfo, checkLpFarmAllowance, confirmLpFarmAllowance, getLpBalanceFarm })(Farm);
