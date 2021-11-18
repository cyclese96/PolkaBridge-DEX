import React from "react";
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
  getPercentageAmount,
  toWei,
} from "../../utils/helper";
import { swapTokens } from "../../actions/dexActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import TransactionStatus from "./TransactionStatus";

import { default as NumberFormat } from 'react-number-format';
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
      width: "80vw",
      height: "100%",
      maxHeight: "80vh",
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
    fontSize: 13,
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
    borderRadius: 50,
    fontSize: 15,
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
    color: "#f6f6f6",

    transition: "all 0.4s ease",
    fontSize: 22,
    backgroundColor: "#191B1E",
  },
}));

const SwapConfirm = (props) => {
  const {
    open,
    priceRatio,
    handleClose,
    priceImpact,
    account: { currentAccount, currentNetwork, loading },
    selectedToken1,
    selectedToken2,
    token1Value,
    token2Value,
    dex: { swapSettings, dexLoading, transaction },
    currentSwapFn,
    currenSwapPath,
    swapTokens,
  } = props;

  const classes = useStyles();

  const onConfirmSwap = async () => {

    const _amount0InWei = toWei(token1Value, selectedToken1.decimals);
    const token0 = {
      amount: _amount0InWei,
      min: toWei(token1Value.toString(), selectedToken1.decimals),
      ...selectedToken1,
    };

    const _amount1InWei = toWei(token2Value, selectedToken2.decimals);
    const token1 = {
      amount: _amount1InWei,
      min: toWei(token2Value.toString(), selectedToken2.decimals),
      ...selectedToken2,
    };

    await swapTokens(
      token0,
      token1,
      swapSettings.deadline,
      currentSwapFn,
      currenSwapPath,
      currentAccount,
      currentNetwork
    );
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
          style: { borderRadius: 15, backgroundColor: "#121827" },
        }}
      >
        {transaction.type === null && (
          <div className={classes.background}>
            <DialogTitle onClose={() => handleClose()}>
              <span className={classes.heading}>Confirm Swap</span>
            </DialogTitle>
            <div className={classes.tokenCard}>
              <div className="d-flex justify-content-between w-100">
                <div>
                  <span className={classes.subheading}> From : </span>
                  {" "}
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
                    symbol={selectedToken2.symbol}
                    address={selectedToken2.address}
                  />
                  <span style={{ marginLeft: 2 }}>
                    {" "}
                    {selectedToken2.symbol}
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
                1 {selectedToken1.symbol} {" = "}{" "}
                <NumberFormat
                  displayType="text"
                  value={priceRatio}
                  decimalScale={5}
                />
                {" "}{selectedToken2.symbol}
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
                  <span className={classes.detailTitle}>
                    Liquidity provider fee
                  </span>
                  <span className={classes.detailValue}>
                    <NumberFormat displayType="text" value={getPercentageAmount(token1Value, "0.2 ")} decimalScale={5} />
                    {" "}{selectedToken1.symbol}
                  </span>
                </div>
                {/* <div className="d-flex justify-content-between w-100 mt-1 mb-1 ">
              <span>Route</span>
              <span>
                {selectedToken1.symbol} {">"} {selectedToken2.symbol}
              </span>
            </div> */}
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
                    />
                    {" "}
                    {selectedToken2.symbol}
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
                  dexLoading ||
                  !isValidSlippage ||
                  !isValidSlippage() ||
                  loading
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
        )}

        <div>
          {transaction.type !== null && (
            <div>
              <TransactionStatus onClose={() => handleClose()} />
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

export default connect(mapStateToProps, { swapTokens })(SwapConfirm);
