import { Button, Card, Divider, makeStyles } from "@material-ui/core";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import Varified from "../../../assets/check.png";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import TokenIcon from "../../common/TokenIcon";
import { useEffect, useMemo } from "react";
import {
  allowanceAmount,
  BASE_URL,
  farmingPoolConstants,
} from "../../../constants";
import { connect } from "react-redux";
import { formattedNum } from "../../../utils/formatters";
import {
  checkLpFarmAllowance,
  confirmLpFarmAllowance,
  getFarmInfo,
  getLpBalanceFarm,
  stakeLpTokens,
} from "../../../actions/farmActions";
import BigNumber from "bignumber.js";
import { fromWei, getLpApr, getPbrRewardApr } from "../../../utils/helper";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 350,
    borderRadius: 15,
    marginTop: 20,
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("md")]: {
      paddingLeft: 7,
      paddingRight: 7,
      width: 300,
    },
  },
  cardContents: {},
  avatar: {
    height: "30px",
  },
  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 14,
    paddingBottom: 3,
    color: theme.palette.textColors.heading,
    paddingTop: 2,
  },
  link: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 13,
    paddingBottom: 4,
    color: "#DF097C",
    paddingTop: 2,
  },
  tokenValues: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 24,
    paddingBottom: 3,

    color: theme.palette.textColors.subheading,
  },
  tokenAmount: {
    fontWeight: 600,
    marginRight: 5,
    fontSize: 16,
    color: theme.palette.textColors.pbr,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  earn: {
    textAlign: "center",
    color: theme.palette.textColors.subheading,
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid #C80C81",
    borderRadius: 25,
    height: 30,
    width: 100,
    paddingTop: 3,
  },
  farmName: {
    textAlign: "center",
    color: theme.palette.textColors.heading,

    fontSize: 15,
    fontWeight: 600,
  },
  tagWrapper: {
    padding: 8,
  },
  imgWrapper: {
    padding: 15,
  },
  harvestButton: {
    backgroundColor: theme.palette.primary.iconBack,
    color: theme.palette.textColors.heading,
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
    },
  },
  approveBtn: {
    backgroundColor: theme.palette.primary.pbr,
    color: theme.palette.primary.buttonText,
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
    [theme.breakpoints.down("md")]: {
      fontSize: 14,
    },
  },
  stakeBtn: {
    backgroundColor: theme.palette.primary.pbr,
    color: theme.palette.primary.buttonText,
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
    [theme.breakpoints.down("md")]: {
      fontSize: 14,
    },
  },
  icon: {
    fontSize: 16,
  },
}));

const Farm = (props) => {
  const {
    farmPool,
    handleDialogClose,
    onStake,
    account: { currentAccount, currentNetwork },
    farm: { farms, lpApproved, loading, lpBalance },
    dex: { transaction },
    getFarmInfo,
    checkLpFarmAllowance,
    confirmLpFarmAllowance,
    getLpBalanceFarm,
    stakeLpTokens,
  } = props;
  const classes = useStyles();

  useEffect(() => {
    if (!currentAccount || !currentNetwork) {
      return;
    }

    async function loadFarmData() {
      await Promise.all([
        checkLpFarmAllowance(
          farmPoolAddress(farmPool),
          currentAccount,
          currentNetwork
        ),
        getFarmInfo(
          farmPoolAddress(farmPool),
          farmPoolId(farmPool),
          currentAccount,
          currentNetwork
        ),
        getLpBalanceFarm(
          farmPoolAddress(farmPool),
          currentAccount,
          currentNetwork
        ),
      ]);
    }
    loadFarmData();
  }, [currentAccount]);

  const farmPoolAddress = (_farmPool) => {
    return farmingPoolConstants?.ethereum?.[_farmPool]?.address;
  };

  const farmPoolId = (_farmPool) => {
    return farmingPoolConstants?.ethereum?.[_farmPool]?.pid;
  };

  const farmPoolDecimals = (_farmPool) => {
    return farmingPoolConstants?.ethereum?.[_farmPool]?.decimals;
  };

  const farmData = (_farmPool) => {
    if (!farmPool) {
      return null;
    }

    if (!Object.keys(farms).includes(farmPoolAddress(_farmPool))) {
      return {};
    }
    return farms?.[farmPoolAddress(_farmPool)];
  };

  const handleApproveLpTokenToFarm = async () => {
    await confirmLpFarmAllowance(
      allowanceAmount,
      farmPoolAddress(farmPool),
      currentAccount,
      currentNetwork
    );
  };

  const getFarmTotalApr = (_address) => {
    if (!_address) {
      return "";
    }

    const totalPoolLiquidityUSD = lpBalance?.[_address]?.poolLiquidityUSD;
    const pbrPrice = lpBalance?.[_address]?.pbrPriceUSD;
    const poolWeight = farms?.[_address]?.poolWeight;

    const pbrRewardApr = getPbrRewardApr(
      poolWeight,
      pbrPrice,
      totalPoolLiquidityUSD
    );
    const totalApr = new BigNumber(pbrRewardApr)
      .plus(getLpApr(farmPool))
      .toFixed(0)
      .toString();
    return totalApr;
  };

  const farmApr = useMemo(
    () => getFarmTotalApr(farmPoolAddress(farmPool)),
    [farmPoolAddress(farmPool), farms, lpBalance]
  );

  const handleStakeActions = (actionType = "stake") => {
    onStake(
      farmPool,
      actionType,
      farmPoolAddress(farmPool),
      farmPoolDecimals(farmPool),
      farmPoolId(farmPool)
    );
  };

  const harvestDisableStatus = (_farmPool) => {
    return (
      loading?.[farmPoolAddress(_farmPool)] ||
      new BigNumber(
        !farmData(_farmPool).pendingPbr ? 0 : farmData(_farmPool).pendingPbr
      ).eq(0)
    );
  };

  const handleHarvest = async (_farmPool) => {
    await stakeLpTokens(
      "0",
      farmPoolAddress(_farmPool),
      farmPoolId(_farmPool),
      currentAccount,
      currentNetwork
    );

    await getFarmInfo(
      farmPoolAddress(_farmPool),
      farmPoolId(_farmPool),
      currentAccount,
      currentNetwork
    );
  };

  const parseStakedAmount = useMemo(
    () =>
      fromWei(
        farms?.[farmPoolAddress(farmPool)]?.stakeData?.amount,
        farmPoolDecimals(farmPool)
      ),
    [farmPool, farms]
  );

  return (
    <Card elevation={10} className={classes.card}>
      <div className={classes.cardContents}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.imgWrapper}>
            <TokenIcon
              className={classes.avatar}
              symbol={farmPool?.split("-")?.[0]}
            />
            <TokenIcon
              className={classes.avatar}
              symbol={farmPool?.split("-")?.[1]}
            />
          </div>
          <div>
            <div className={classes.farmName}>{farmPool}</div>
            <div className={classes.tagWrapper}>
              <div className={classes.earn}>
                <img
                  style={{ height: 20, width: 20, marginRight: 5 }}
                  src={Varified}
                />
                Core{" "}
                {farmingPoolConstants?.[currentNetwork]?.[farmPool]?.multiplier}
                X
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.tokenTitle}>APR </div>

          <div className="d-flex align-items-center">
            <div className={classes.tokenAmount}>{farmApr}% </div>
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
          <div className={classes.tokenValues}>
            {formattedNum(fromWei(farmData(farmPool)?.pendingPbr))}
          </div>
          <Button
            className={classes.harvestButton}
            disabled={harvestDisableStatus(farmPool)}
            onClick={() => handleHarvest(farmPool)}
          >
            Harvest
          </Button>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className={classes.tokenTitle}>{farmPool} LP STAKED</div>
          <div className={classes.tokenAmount}></div>
        </div>

        {!loading?.[farmPoolAddress(farmPool)] &&
          !lpApproved?.[farmPoolAddress(farmPool)] && (
            <div className="d-flex justify-content-center align-items-center mt-1">
              <Button
                onClick={handleApproveLpTokenToFarm}
                className={classes.approveBtn}
              >
                Approve LP Tokens
              </Button>
            </div>
          )}

        {!loading?.[farmPoolAddress(farmPool)] &&
          lpApproved?.[farmPoolAddress(farmPool)] && (
            <div className="d-flex justify-content-between align-items-center mt-1">
              <div className={classes.tokenValues}>
                {formattedNum(parseStakedAmount)}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  onClick={() => handleStakeActions("stake")}
                  className={classes.stakeBtn}
                  style={{ marginRight: 5 }}
                >
                  +
                </Button>
                <Button
                  onClick={() => handleStakeActions("unstake")}
                  className={classes.stakeBtn}
                  style={{ fontSize: 36 }}
                >
                  -
                </Button>
              </div>
            </div>
          )}

        {loading?.[farmPoolAddress(farmPool)] && (
          <div className="d-flex justify-content-center align-items-center mt-1">
            <Button disabled={true} className={classes.approveBtn}>
              {transaction.type && transaction.status === "pending"
                ? "Pending transaction..."
                : "Loading pool..."}
            </Button>
          </div>
        )}

        <div className="mt-3">
          <Divider style={{ backgroundColor: "#616161", height: 1 }} />
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className={classes.tokenTitle}>Total Liquidity:</div>
          <div className={classes.tokenAmount}>
            $
            {formattedNum(
              lpBalance?.[farmPoolAddress(farmPool)]?.poolLiquidityUSD
            )}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <a
            className={classes.link}
            target="_blank"
            href={`${BASE_URL}/liquidity?action=add_liquidity&inputCurrency=${
              farmPool && farmPool.split("-")[0]
            }&outputCurrency=${farmPool && farmPool.split("-")[1]}`}
          >
            Get {farmPool} LP{" "}
            <OpenInNewIcon fontSize="small" className={classes.icon} />{" "}
          </a>
          <div className={classes.tokenAmount}></div>
        </div>

        <div className="d-flex justify-content-between align-items-center ">
          <a
            target="_blank"
            className={classes.link}
            href={`https://rinkeby.etherscan.io/address/${farmPoolAddress(
              farmPool
            )}`}
          >
            View Contract{" "}
            <OpenInNewIcon fontSize="small" className={classes.icon} />{" "}
          </a>
          <div className={classes.tokenAmount}></div>
        </div>

        <div className="d-flex justify-content-between align-items-center ">
          <a
            target="_blank"
            className={classes.link}
            href={`http://localhost:3000/pair/${farmPoolAddress(farmPool)}`}
          >
            See Pair Info{" "}
            <OpenInNewIcon fontSize="small" className={classes.icon} />{" "}
          </a>
        </div>
      </div>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  farm: state.farm,
  dex: state.dex,
});

export default connect(mapStateToProps, {
  getFarmInfo,
  checkLpFarmAllowance,
  confirmLpFarmAllowance,
  getLpBalanceFarm,
  stakeLpTokens,
})(Farm);
