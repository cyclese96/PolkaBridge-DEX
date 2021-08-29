import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CustomButton from "../Buttons/CustomButton";
import { connect } from "react-redux";
import TokenIcon from "./TokenIcon";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {
  formatFloat,
  getPercentage,
  getPercentageAmount,
  getPriceRatio,
  toWei,
} from "../../utils/helper";
import {
  swapExactEthForTokens,
  swapExactTokensForEth,
} from "../../actions/dexActions";
import { ETH } from "../../constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import BigNumber from "bignumber.js";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#121827",
    color: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 350,
    // height: 380,
    [theme.breakpoints.down("sm")]: {
      width: 320,
      //   height: 350,
    },
  },
  cardContainer: {
    backgroundColor: "#121827",
    color: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  heading: {
    fontSize: 18,
    fontWeight: 400,
    color: "#f4f4f4",
  },
  subheading: {
    fontSize: 12,
    fontWeight: 400,
    color: "#989898",
  },

  tokenCard: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "space-between",
    width: "90%",
    border: "0.1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  priceCard: {},

  buttons: {
    marginTop: 15,
    paddingBottom: 10,
  },
  confirmButton: {
    width: 220,
    height: 50,
  },
  acceptPrice: {
    height: 35,
  },
}));

const SwapConfirm = (props) => {
  const {
    open,
    handleClose,
    priceImpact,
    account: { currentAccount, currentNetwork, loading },
    selectedToken1,
    selectedToken2,
    token1Value,
    token2Value,
    dex: { swapSettings, poolReserves, dexLoading },
    swapExactEthForTokens,
    swapExactTokensForEth,
  } = props;

  const classes = useStyles();

  const onConfirmSwap = async () => {
    // todo swap code

    const token1 = {
      amount: toWei(token1Value.toString()),
      min: toWei(token1Value.toString()),
      ...selectedToken1,
    };

    const token2 = {
      amount: toWei(token2Value.toString()),
      min: toWei(token2Value.toString()),
      ...selectedToken2,
    };

    if (token1.symbol === ETH) {
      //buy trade
      await swapExactEthForTokens(
        token1,
        token2,
        swapSettings.deadline,
        currentAccount,
        currentNetwork
      );
    } else {
      //sell trade
      await swapExactTokensForEth(
        token1,
        token2,
        swapSettings.deadline,
        currentAccount,
        currentNetwork
      );
    }

    handleClose();
  };

  const isValidSlippage = () => {
    if (new BigNumber(priceImpact).lt(swapSettings.slippage)) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        disableBackdropClick
        className={classes.dialog}
        color="transparent"
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <div className={classes.background}>
          <DialogTitle onClose={() => handleClose()}>
            <span className={classes.heading}>Confirm Swap</span>
          </DialogTitle>
          <div className={classes.tokenCard}>
            <div className="d-flex justify-content-start w-100 mb-1">
              <span className={classes.subheading}> From</span>
              <span></span>
            </div>
            <div className="d-flex justify-content-between w-100">
              <div>
                <TokenIcon symbol={selectedToken1.symbol} />
                <span style={{ marginLeft: 2 }}> {selectedToken1.symbol}</span>
              </div>
              <span>{token1Value}</span>
            </div>
          </div>

          <div className="mt-2 mb-2">
            <ArrowDownwardIcon fontSize="small" />
          </div>

          <div className={classes.tokenCard}>
            <div className="d-flex justify-content-start w-100 mb-1">
              <span className={classes.subheading}>To</span>
              <span></span>
            </div>
            <div className="d-flex justify-content-between w-100">
              <div>
                <TokenIcon symbol={selectedToken2.symbol} />
                <span style={{ marginLeft: 2 }}> {selectedToken2.symbol}</span>
              </div>
              <span>{token2Value}</span>
            </div>
          </div>

          <div className="d-flex justify-content-around w-100 mt-2 mb-2 ">
            <span className={classes.subheading}>Price</span>
            <span className={classes.subheading}>
              1 {selectedToken1.symbol} {" = "}{" "}
              {getPriceRatio(
                poolReserves[selectedToken2.symbol],
                poolReserves[selectedToken1.symbol]
              )}{" "}
              {selectedToken2.symbol}
            </span>
          </div>

          {dexLoading ? (
            <div className={classes.tokenCard}>
              <div className="d-flex justify-content-center w-100 mt-1 mb-1 ">
                <CircularProgress
                  style={{ color: "#E0077D" }}
                  color="secondary"
                  size={30}
                />
              </div>
              <div className="d-flex justify-content-center w-100 mt-1 mb-1 ">
                <span>Validating swap</span>
              </div>
            </div>
          ) : (
            <div className={classes.tokenCard}>
              <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                <span>Liquidity provider fee</span>
                <span>
                  {getPercentageAmount(token1Value, "0.2 ")}{" "}
                  {selectedToken1.symbol}
                </span>
              </div>
              {/* <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
              <span>Route</span>
              <span>
                {selectedToken1.symbol} {">"} {selectedToken2.symbol}
              </span>
            </div> */}
              <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                <span>Price impact</span>
                <span>- {formatFloat(priceImpact)} %</span>
              </div>
              <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                <span>Minimum received</span>
                <span>
                  {token2Value} {selectedToken2.symbol}
                </span>
              </div>

              <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                <span>Slippage tolerance</span>
                <span>{swapSettings.slippage} %</span>
              </div>
            </div>
          )}
          {/* <div className="d-flex justify-content-around align-items-center w-100 mt-2">
            <span>Price updated</span>
            <CustomButton  className={classes.acceptPrice} variant="primary">
              Accept
            </CustomButton>
          </div> */}
          <div className="d-flex justify-content-center mt-1">
            <span className={classes.subheading}>
              {isValidSlippage()
                ? ""
                : "Your slippage is less than price impact"}
            </span>
          </div>
          <div className={classes.buttons}>
            <CustomButton
              className={classes.confirmButton}
              onClick={onConfirmSwap}
              disabled={
                dexLoading || !isValidSlippage || !isValidSlippage() || loading
              }
            >
              {loading ? (
                <>
                  Transaction pending
                  <CircularProgress
                    style={{ color: "black" }}
                    color="secondary"
                    size={30}
                  />
                </>
              ) : (
                "Confirm Swap"
              )}
            </CustomButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {
  swapExactTokensForEth,
  swapExactEthForTokens,
})(SwapConfirm);
