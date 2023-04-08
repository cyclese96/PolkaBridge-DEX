import React, { useState } from "react";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import CloseIcon from "@material-ui/icons/Close";
import { fromWei, toWei } from "../../../utils/helper";
import { formatCurrency } from "../../../utils/formatters";
import TransactionPopup from "../../common/TransactionPopup";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import NumberInput from "../../../components/common/NumberInput";
import { useTransactionCallback } from "../../../hooks/useTransactionCallback";
import { TransactionStatus } from "../../../constants/index";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    borderRadius: 15,

    borderRadius: 30,
    backgroundColor: theme.palette.primary.bgCard,
    filter: "drop-shadow(0 0 0.5rem #212121)",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      width: "98%",
    },
  },
  tokenTitle: {
    fontWeight: 500,
    fontSize: 16,
    paddingBottom: 3,

    color: theme.palette.textColors.heading,
  },
  maxButton: {
    width: "fit-content",
    backgroundColor: "rgba(223, 9, 124,0.5)",
    color: "white",
    textTransform: "none",
    fontSize: 14,
    padding: "2px 2px 2px 2px",
    marginBottom: 4,
    marginRight: 4,
    borderRadius: 15,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      width: "80%",
    },
  },
  header: {
    color: theme.palette.textColors.heading,

    fontSize: 22,
    fontWeight: 600,
  },
  section: {
    color: theme.palette.textColors.subheading,

    fontSize: 16,
    fontWeight: 600,
  },
  inputSection: {
    padding: 7,
    width: "100%",
    borderRadius: 30,
    padding: 20,
    backgroundColor: "rgba(41, 42, 66, 0.01)",

    marginTop: 20,
    borderRadius: 15,
    // background: `#29323c`,
    [theme.breakpoints.down("xs")]: {
      padding: 15,
      width: "100%",
    },
  },
  confirmButton: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
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
    },
  },
  cancelButton: {
    backgroundColor: "#2C2F35",
    color: "white",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 20,

    padding: "8px 50px 8px 50px",

    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  input: {
    backgroundColor: "#eeeeee",
    height: 50,

    border: "1px solid #e5e5e5",
    borderRadius: 10,

    fontSize: 18,
    width: 190,
    color: theme.palette.textColors.heading,
    outline: "none",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      width: 80,
      padding: 7,
      fontSize: 15,
      marginTop: 10,
      height: 50,
      width: 250,
    },
  },
}));

const StakeDialog = ({ open, type, poolInfo, handleClose }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const [maxValue, setMax] = useState("");
  const { chainId, account } = useActiveWeb3React();
  const { transaction } = useSelector((state) => state?.dex);
  const { farms, lpBalance } = useSelector((state) => state?.farm);

  const parseLpBalance = useMemo(() => {
    if (!lpBalance || !lpBalance?.[poolInfo.poolAddress]?.lpBalance) {
      return "0";
    }
    return fromWei(
      lpBalance?.[poolInfo.poolAddress]?.lpBalance,
      poolInfo.poolDecimals
    );
  }, [poolInfo.pid, lpBalance]);

  const parseStakedAmount = useMemo(() => {
    if (!farms || !farms?.[poolInfo.poolAddress]?.stakeData?.amount) {
      return "0";
    }
    return fromWei(
      farms?.[poolInfo.poolAddress]?.stakeData?.amount,
      poolInfo.poolDecimals
    );
  }, [poolInfo.pid, farms]);

  const handleMax = () => {
    if (type === "stake") {
      // setInputValue(parseLpBalance, poolInfo.pid, account, chainId);
      setMax(lpBalance?.[poolInfo.poolAddress]?.lpBalance);
    } else {
      setMax(farms?.[poolInfo.poolAddress]?.stakeData?.amount);
      // setInputValue(parseStakedAmount, poolInfo.pid, account, chainId);
    }
  };

  const { stakeLpTokens, unstakeLpTokens, resetTrxState } =
    useTransactionCallback();

  const confirmStake = async () => {
    const inputTokens = !maxValue ? inputValue : maxValue;

    if (new BigNumber(inputTokens).lte(0)) {
      return;
    }

    if (
      type === "stake" &&
      new BigNumber(inputTokens).gt(
        lpBalance?.[poolInfo.poolAddress]?.lpBalance
      )
    ) {
      return;
    }

    if (
      type === "unstake" &&
      new BigNumber(inputTokens).gt(
        farms?.[poolInfo.poolAddress]?.stakeData?.amount
      )
    ) {
      return;
    }

    if (type === "stake") {
      await stakeLpTokens(inputTokens, poolInfo.pid, account, chainId);
    } else {
      await unstakeLpTokens(inputTokens, poolInfo.pid, account, chainId);
    }
  };

  const closeAction = () => {
    handleClose();

    if (
      transaction?.status &&
      [TransactionStatus.FAILED, TransactionStatus.COMPLETED].includes(
        transaction?.status
      )
    ) {
      resetTrxState();
    }

    setTimeout(() => {
      setInputValue("");
    }, 500);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableBackdropClick
      className={classes.dialog}
      color="transparent"
      PaperProps={{
        style: {
          borderRadius: 30,
          backgroundColor: "transparent",
          color: "#f9f9f9",
        },
      }}
    >
      {transaction.type === null && (
        <div className={classes.card}>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className={classes.header}>
              {type === "stake" ? "Stake" : "Unstake"} LP token
            </h1>
            <div>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={closeAction}
              >
                <CloseIcon
                  style={{ color: "rgba(224, 7, 125, 0.9)", padding: 0 }}
                />
              </IconButton>
            </div>
          </div>
          <div className="mt-2">
            <Divider style={{ backgroundColor: "grey", height: 1 }} />
          </div>
          <div className={classes.inputSection}>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div>
                <h1 className={classes.section}>
                  {type === "stake" ? "Stake" : "Unstake"}
                </h1>
              </div>
              <div>
                {type === "stake" ? (
                  <h1 className={classes.section}>
                    Balance:
                    {formatCurrency(parseLpBalance)}
                  </h1>
                ) : (
                  <h1 className={classes.section}>
                    LP Staked: {formatCurrency(parseStakedAmount)}
                  </h1>
                )}
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-2">
              <div>
                <NumberInput
                  onInputChange={(value) => {
                    setInputValue(value);
                    setMax("");
                  }}
                  value={
                    !maxValue
                      ? inputValue
                      : fromWei(maxValue, poolInfo.poolDecimals)
                  }
                  style={classes.input}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <Button className={classes.maxButton} onClick={handleMax}>
                    Max
                  </Button>
                </div>
                <div>
                  <h1 className={classes.section}>{poolInfo.farmPool} LP</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around align-items-center mt-3">
            <Button
              // variant="text"
              className={classes.cancelButton}
              onClick={closeAction}
            >
              Cancel
            </Button>
            <Button className={classes.confirmButton} onClick={confirmStake}>
              Confirm
            </Button>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
            <a
              target="_blank"
              rel="noreferrer"
              href={`/liquidity?action=add_liquidity&inputCurrency=${
                poolInfo?.farmPool && poolInfo?.farmPool?.split("-")?.[0]
              }&outputCurrency=${
                poolInfo?.farmPool && poolInfo?.farmPool?.split("-")?.[1]
              }`}
            >
              {" "}
              <div
                className={classes.tokenTitle}
                style={{ color: "rgba(223, 9, 124,0.9)" }}
              >
                Get {poolInfo.farmPool} LP <OpenInNewIcon fontSize="small" />{" "}
              </div>{" "}
            </a>
            <div className={classes.tokenAmount}></div>
          </div>
        </div>
      )}

      <div>
        {transaction.type !== null && (
          <div>
            <TransactionPopup onClose={closeAction} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default StakeDialog;
