import React, { useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import TokenIcon from "./TokenIcon";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { getPercentageAmount, toWei } from "../../utils/helper";
import TransactionPopup from "./TransactionPopup";

import { default as NumberFormat } from "react-number-format";
import BigNumber from "bignumber.js";
import { Button } from "@material-ui/core";
import { useTransactionCallback } from "hooks/useTransactionCallback";
import { TransactionStatus } from "../../constants/index";

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
    backgroundColor: theme.palette.primary.bgCard,
    color: theme.palette.textColors.heading,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 350,
    // height: 380,
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
      height: "100%",
      maxHeight: "80vh",
    },
  },
  heading: {
    fontSize: 18,
    fontWeight: 400,

    color: theme.palette.textColors.heading,
  },
  subheading: {
    fontSize: 13,
    fontWeight: 400,
    color: theme.palette.textColors.subheading,
  },

  tokenCard: {
    width: "90%",
    border: "0.7px solid rgba(224, 224, 224,0.9)",
    borderRadius: 10,
    padding: 10,
  },
  confirmButton: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: theme.palette.primary.pbr,
    color: "white",
    width: "90%",
    textTransform: "none",
    borderRadius: 20,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    padding: "12px 50px 12px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  acceptPrice: {
    height: 35,
  },
  detailTitle: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 12,
  },
  icon: {
    color: theme.palette.primary.iconColor,
    transition: "all 0.4s ease",
    fontSize: 22,
    borderRadius: 30,
  },
  message: {
    marginTop: 15,
    color: theme.palette.textColors.heading,
    fontSize: 16,
  },
}));

const TransactionConfirm = (props) => {
  const {
    open,
    priceRatio,
    handleClose,
    priceImpact,
    account: { loading },
    chainId,
    currentAccount,
    selectedToken0,
    selectedToken1,
    token1Value,
    token2Value,
    dex: { swapSettings, dexLoading, transaction },
    currentSwapFn,
    currenSwapPath,
    type = "swap",
  } = props;

  const classes = useStyles();

  const { swapTokens, resetTrxState } = useTransactionCallback();
  const onConfirmSwap = async () => {
    const _amount0InWei = toWei(token1Value, selectedToken0.decimals);
    const token0 = {
      amount: _amount0InWei,
      min: toWei(token1Value.toString(), selectedToken0.decimals),
      ...selectedToken0,
    };

    const _amount1InWei = toWei(token2Value, selectedToken1.decimals);
    const token1 = {
      amount: _amount1InWei,
      min: toWei(token2Value.toString(), selectedToken1.decimals),
      ...selectedToken1,
    };

    await swapTokens(
      token0.amount,
      token1.amount,
      swapSettings.deadline,
      currentSwapFn,
      currenSwapPath,
      currentAccount,
      chainId
    );
  };

  const onPopupClose = useCallback(() => {
    handleClose();
    if (transaction?.status !== TransactionStatus.PENDING) {
      resetTrxState();
    }
  }, [transaction, resetTrxState, handleClose]);

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
          style: { borderRadius: 15, backgroundColor: "#121827" },
        }}
      >
        {type === "swap" &&
          transaction.type === null &&
          !transaction?.status && (
            <div className={classes.background}>
              <DialogTitle onClose={() => handleClose()}>
                <span className={classes.heading}>Confirm Swap</span>
              </DialogTitle>
              <div className={classes.tokenCard}>
                <div className="d-flex justify-content-between w-100">
                  <div>
                    <span className={classes.subheading}> From : </span>{" "}
                    <TokenIcon
                      symbol={selectedToken0.symbol}
                      address={selectedToken0.address}
                    />
                    <span style={{ marginLeft: 2 }}>
                      {" "}
                      {selectedToken0.symbol}
                    </span>
                  </div>
                  <span>
                    <NumberFormat
                      displayType="text"
                      value={token1Value}
                      decimalScale={7}
                    />
                  </span>
                </div>
              </div>

              <div>
                <ArrowDownwardIcon fontSize="small" className={classes.icon} />
              </div>

              <div className={classes.tokenCard}>
                <div className="d-flex justify-content-between w-100">
                  <div>
                    <span className={classes.subheading}>To : </span>
                    <TokenIcon
                      symbol={selectedToken1.symbol}
                      address={selectedToken1.address}
                    />
                    <span style={{ marginLeft: 2 }}>
                      {" "}
                      {selectedToken1.symbol}
                    </span>
                  </div>
                  <span>
                    <NumberFormat
                      displayType="text"
                      value={token2Value}
                      decimalScale={7}
                    />
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-around w-100 mt-2 mb-2 ">
                <span className={classes.subheading}>Swap Price:</span>
                <span className={classes.subheading}>
                  1 {selectedToken0.symbol} {" = "}{" "}
                  <NumberFormat
                    displayType="text"
                    value={priceRatio}
                    decimalScale={5}
                  />{" "}
                  {selectedToken1.symbol}
                </span>
              </div>

              <div className={classes.tokenCard}>
                <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                  <span className={classes.detailTitle}>
                    Liquidity provider fee
                  </span>
                  <span className={classes.detailValue}>
                    <NumberFormat
                      displayType="text"
                      value={getPercentageAmount(token1Value, "0.2 ")}
                      decimalScale={5}
                    />{" "}
                    {selectedToken0.symbol}
                  </span>
                </div>

                <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                  <span className={classes.detailTitle}>Price impact</span>
                  <span className={classes.detailValue}>
                    -{" "}
                    <NumberFormat
                      displayType="text"
                      value={priceImpact}
                      decimalScale={5}
                    />
                    %
                  </span>
                </div>
                <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                  <span className={classes.detailTitle}>Minimum received</span>
                  <span className={classes.detailValue}>
                    <NumberFormat
                      displayType="text"
                      value={token2Value}
                      decimalScale={5}
                    />{" "}
                    {selectedToken1.symbol}
                  </span>
                </div>

                <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
                  <span className={classes.detailTitle}>
                    Slippage tolerance
                  </span>
                  <span className={classes.detailValue}>
                    {swapSettings.slippage} %
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-center mt-1">
                <span className={classes.subheading}>
                  {isValidSlippage()
                    ? ""
                    : "Price impact is more than your slippage!"}
                </span>
              </div>
              {/* <div className={classes.buttons}> */}
              <Button
                className={classes.confirmButton}
                onClick={onConfirmSwap}
                disabled={
                  dexLoading ||
                  !isValidSlippage ||
                  !isValidSlippage() ||
                  loading
                }
              >
                Confirm Swap
              </Button>
              {/* </div> */}
            </div>
          )}

        <div>
          {transaction.type !== null && (
            <div>
              <TransactionPopup onClose={() => onPopupClose()} />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {})(React.memo(TransactionConfirm));
