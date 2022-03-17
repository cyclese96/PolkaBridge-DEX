import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import TabPage from "../../TabPage";
import Farm from "./Farm";
import {
  farmingPoolConstants,
  supportedFarmingPools,
} from "../../../constants/index";
import StakeDialog from "./StakeDialog";
import store from "../../../store";
import { START_TRANSACTION } from "../../../actions/types";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { getNetworkNameById } from "utils/helper";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    color: theme.palette.textColors.heading,
    fontSize: 36,
    fontWeight: 600,
  },
  subTitle: {
    textAlign: "center",
    color: theme.palette.textColors.subheading,
    fontSize: 24,
    fontWeight: 600,
    [theme.breakpoints.down("md")]: {
      fontSize: 15,
      fontWeight: 600,
    },
  },
}));

const Farms = (props) => {
  const {
    dex: { transaction },
    farm: {},
  } = props;

  const classes = useStyles();
  const [stakeDialog, setStakeDialog] = useState({
    open: false,
    type: "stake",
    poolInfo: {},
  });
  const { chainId } = useActiveWeb3React();

  const handleStake = (farmPool, type, poolAddress, poolDecimals, pid) => {
    setStakeDialog({
      type: type,
      open: true,
      poolInfo: { farmPool, poolAddress, poolDecimals, pid },
    });
  };

  // swap status updates
  useEffect(() => {
    if (!transaction.hash && !transaction.type) {
      return;
    }

    if (
      transaction.type === "approve" ||
      (transaction.type === "stake" && !stakeDialog.open)
    ) {
      setStakeDialog({ type: null, open: true, poolInfo: {} });
    }
  }, [transaction]);

  const handleDialogClose = () => {
    setStakeDialog({ ...stakeDialog, open: false });
    //check reset transaction on dialog close: don't reset if transaction already pending
    if (
      (transaction.type === "approve" || transaction.type === "stake") &&
      transaction.status !== "pending"
    ) {
      setTimeout(() => {
        store.dispatch({ type: START_TRANSACTION });
      }, 200);
    }
  };

  const farmPools = useMemo(() => {
    return Object.keys(supportedFarmingPools).includes(chainId?.toString())
      ? supportedFarmingPools?.[chainId].map((poolName) => {
          return {
            name: poolName,
            address: farmingPoolConstants?.[chainId]?.[poolName]?.address,
            multiplier: farmingPoolConstants?.[chainId]?.[poolName]?.multiplier,
            pid: farmingPoolConstants?.[chainId]?.[poolName]?.pid,
            lpApr: farmingPoolConstants?.[chainId]?.[poolName]?.lpApr,
            decimals: farmingPoolConstants?.[chainId]?.[poolName]?.decimals,
          };
        })
      : [];
  }, [chainId]);

  const currentNetwork = useMemo(
    () => getNetworkNameById(chainId ? chainId : 1),
    [chainId]
  );

  return (
    <>
      <div>
        <TabPage data={2} />
      </div>
      <div className="mt-5 mb-2 container row">
        <div className={classes.subTitle}>
          {farmPools?.length === 0
            ? "Farming will be available soon on " + currentNetwork + " network"
            : "Stake LP tokens to Earn Rewards"}
        </div>
      </div>
      <div
        className="container row flex-row justify-content-center align-items-center mb-5"
        align="center"
      >
        {farmPools?.map((farmPool) => {
          return (
            <div className="col-12 col-xl-4 col-lg-6">
              <Farm farmPool={farmPool} onStake={handleStake} />
            </div>
          );
        })}

        <div>
          <StakeDialog
            poolInfo={stakeDialog.poolInfo}
            open={stakeDialog.open}
            type={stakeDialog.type}
            handleClose={handleDialogClose}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
  farm: state.farm,
});

export default connect(mapStateToProps, {})(Farms);
