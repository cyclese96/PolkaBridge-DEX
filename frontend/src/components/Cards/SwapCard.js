import React, { useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  makeStyles,
  Popper,
} from "@material-ui/core";
import { connect } from "react-redux";
import SwapCardItem from "./SwapCardItem";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import { useState } from "react";
import SwapSettings from "../common/SwapSettings";
import BigNumber from "bignumber.js";
import CustomSnackBar from "../common/CustomSnackbar";
import { ETH, etheriumNetwork, swapFnConstants, tokens } from "../../constants";
import {
  buyPriceImpact,
  formatFloat,
  getPercentageAmount,
  getToken1Out,
  getToken2Out,
  sellPriceImpact,
  toWei,
} from "../../utils/helper";
import {
  checkAllowance,
  confirmAllowance,
  getLpBalance,
  loadPairAddress,
} from "../../actions/dexActions";
import { getAccountBalance } from "../../actions/accountActions";
import SwapConfirm from "../common/SwapConfirm";
import debounce from "lodash.debounce";
import { getPairAddress } from "../../utils/connectionUtils";

import { Info, Settings, SwapCalls, SwapHoriz } from "@material-ui/icons";
import TabPage from "../TabPage";
import TransactionStatus from "../common/TransactionStatus";
import store from "../../store";
import { START_TRANSACTION } from "../../actions/types";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 500,
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
      width: "100%",
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  settingIcon: {
    color: "#f6f6f6",
    color: "#f6f6f6",
    fontSize: 22,
    cursor: "pointer",
    transition: "all 0.4s ease",
    [theme.breakpoints.down("sm")]: {
      fontSize: 17,
    },
  },
  iconButton: {
    margin: 0,
    padding: 2,
  },
  swapIcon: {
    color: "#f6f6f6",
    marginTop: -12,
    marginBottom: -12,
    borderRadius: "36%",
    border: "3px solid #212121",
    transition: "all 0.4s ease",
    fontSize: 28,
    backgroundColor: "#191B1E",
  },
  swapButton: {
    marginTop: 20,
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    width: "95%",
    textTransform: "none",
    fontSize: 19,
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

  rotate1: {
    transform: "rotateZ(0deg)",
  },
  rotate2: {
    transform: "rotateZ(-180deg)",
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  addButton: {
    height: 45,
    width: "90%",
    marginTop: 30,
    marginBottom: 5,
  },
  priceRatio: {
    display: "flex",
    width: "70%",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 30,
  },
  resetIcon: {
    cursor: "pointer",
  },
  tokenPrice: {
    color: "white",
    textAlign: "right",
    width: 430,
    fontSize: 13,

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  infoIcon: {
    color: "white",
    fontSize: 16,
    color: "#bdbdbd",
  },
  txDetailsCard: {
    backgroundColor: "black",
    height: "100%",
    width: 320,
    borderRadius: 10,
    marginTop: 5,
    padding: 14,
    color: "#bdbdbd",
    fontSize: 12,
  },

  txDetailsValue: {
    color: "#ffffff",
    fontSize: 14,
    paddingBottom: 5,
  },
}));

const SwapCard = (props) => {
  const {
    account: { currentNetwork, currentAccount, loading },
    dex: {
      approvedTokens,
      poolReserves,
      pairContractData,
      transaction,
      swapSettings,
    },
    checkAllowance,
    confirmAllowance,
    tokenType,
    getLpBalance,
    getAccountBalance,
    loadPairAddress,
  } = props;

  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState({
    name: "Ethereum",
    symbol: "ETH",
  });
  const [selectedToken2, setToken2] = useState({});
  const [token1Value, setToken1Value] = useState("");
  const [token2Value, setToken2Value] = useState("");

  const [rotate, setRotate] = useState(false);

  const [snackAlert, setAlert] = React.useState({
    status: false,
    message: "",
  });

  const [swapStatus, setStatus] = useState({
    message: "Please select tokens",
    disabled: true,
  });

  const [swapDialogOpen, setSwapDialog] = useState(false);

  const [priceImpact, setPriceImpact] = useState(null);
  const [liquidityStatus, setLiquidityStatus] = useState(false);
  const [localStateLoading, setLocalStateLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [swapTransactionStatus, setSwapTransactionStatus] =
    useState(transaction);

  const handleTxPoper = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [currentSwapFn, setCurrentSwapFn] = useState(
    swapFnConstants.swapExactETHForTokens
  );

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // const updateTokenPrices = async () => {
  //   console.log("updating...");
  //   setTimeout(async () => {
  //     await Promise.all([
  //       getTokenPrice(0, currentNetwork),
  //       getTokenPrice(1, currentNetwork),
  //     ]);
  //     await updateTokenPrices();
  //   }, 1000);
  // };

  useEffect(() => {
    async function initSelection() {
      let _token = {};
      if (currentNetwork === etheriumNetwork) {
        _token = tokens[2];
        setToken1(_token);
      } else {
        _token = {
          name: "Binance",
          symbol: "BNB",
        };
        setToken1(_token);
      }
      setToken1Value("");
      setToken2({});
      setToken2Value("");
      // updateTokenPrices();
    }
    initSelection();
  }, [currentNetwork, currentAccount]);

  const currentPairAddress = () => {
    if (
      Object.keys(pairContractData).includes(
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      ];
    } else if (
      Object.keys(pairContractData).includes(
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      ];
    } else {
      return null;
    }
  };

  const clearInputState = () => {
    setToken1Value("");
    setToken2Value("");
    setStatus({ disabled: true, message: "Enter Amounts" });
  };

  useEffect(() => {
    async function loadPair() {
      if (selectedToken1.symbol && selectedToken2.symbol) {
        setLocalStateLoading(true);

        // reset token input on token selection
        clearInputState();

        // load erc20 token abi and balance
        const erc20Token =
          selectedToken1.symbol === ETH ? selectedToken2 : selectedToken1;

        await getAccountBalance(erc20Token, currentNetwork);

        let _pairAddress = currentPairAddress();
        if (!_pairAddress) {
          _pairAddress = await getPairAddress(
            selectedToken1.address,
            selectedToken2.address,
            currentNetwork
          );

          loadPairAddress(
            selectedToken1.symbol,
            selectedToken2.symbol,
            _pairAddress,
            currentNetwork
          );
        }

        if (!_pairAddress) {
          setLiquidityStatus(true);
          setStatus({
            disabled: true,
            message: "No liquidity available for this pair",
          });
        } else {
          console.log("current pair address ", _pairAddress);
          // setLiquidityStatus(false);

          await getLpBalance(
            selectedToken1,
            selectedToken2,
            _pairAddress,
            currentAccount,
            currentNetwork
          );
        }

        await checkAllowance(selectedToken1, currentAccount, currentNetwork);

        setLocalStateLoading(false);
      }
    }
    loadPair();
  }, [selectedToken1, selectedToken2, currentNetwork, currentAccount]);

  useEffect(() => {
    if (
      poolReserves &&
      (new BigNumber(poolReserves[selectedToken1.symbol]).eq(0) ||
        new BigNumber(poolReserves[selectedToken2.symbol]).eq(0))
    ) {
      setLiquidityStatus(true);
      setStatus({
        disabled: true,
        message: "No liquidity available for this pair",
      });
    }
  }, [poolReserves]);

  const verifySwapStatus = (token1, token2) => {
    let message, disabled;
    const _token1 = new BigNumber(token1.value ? token1.value : 0);
    const _token2 = new BigNumber(token2.value ? token2.value : 0);

    if (token1.selected.symbol === token2.selected.symbol) {
      message = "Invalid pair";
      disabled = true;
    } else if (!token1.selected.symbol || !token2.selected.symbol) {
      message = "Select both tokens";
      disabled = true;
    } else if (
      (_token1.eq("0") && token1.selected.symbol) ||
      (_token2.eq("0") && token2.selected.symbol)
    ) {
      message = "Enter amounts";
      disabled = true;
    } else if (
      _token1.gt("0") &&
      _token2.gt("0") &&
      token1.selected.symbol &&
      token2.selected.symbol
    ) {
      message = "Swap";
      disabled = false;
    }

    setStatus({ message, disabled });
  };

  const debouncedGetLpBalance = useCallback(
    debounce((...params) => getLpBalance(...params), 1000),
    [] // will be created only once initially
  );

  const onToken1InputChange = async (tokens) => {
    setToken1Value(tokens);

    if (selectedToken1.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapExactETHForTokens);
    } else if (selectedToken2.symbol && selectedToken2.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapExactTokensForETH);
    } else {
      setCurrentSwapFn(swapFnConstants.swapExactTokensForTokens);
    }

    // calculate resetpective value of token 2 if selected
    let _token2Value = "";
    const pairAddress = currentPairAddress();

    if (selectedToken2.symbol && new BigNumber(tokens).gt(0) && pairAddress) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        pairAddress,
        currentAccount,
        currentNetwork
      );

      _token2Value = getToken2Out(
        toWei(tokens),
        poolReserves[selectedToken1.symbol],
        poolReserves[selectedToken2.symbol]
      );
      if (new BigNumber(_token2Value).gt(0)) {
        setToken2Value(_token2Value);
        // verify swap status with current inputs
        verifySwapStatus(
          { value: tokens, selected: selectedToken1 },
          { value: _token2Value, selected: selectedToken2 }
        );
      }
    } else if (selectedToken2.symbol && !tokens) {
      setToken2Value("");
      if (!swapStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    }
  };

  const onToken2InputChange = async (tokens) => {
    setToken2Value(tokens);

    if (selectedToken1.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapETHforExactTokens);
    } else if (selectedToken2.symbol && selectedToken2.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapTokensForExactETH);
    } else {
      setCurrentSwapFn(swapFnConstants.swapTokensForExactTokens);
    }

    //calculate respective value of token1 if selected
    let _token1Value = "";
    const pairAddress = currentPairAddress();

    if (selectedToken1.symbol && new BigNumber(tokens).gt(0) && pairAddress) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        pairAddress,
        currentAccount,
        currentNetwork
      );

      _token1Value = getToken1Out(
        toWei(tokens).toString(),
        poolReserves[selectedToken1.symbol],
        poolReserves[selectedToken2.symbol]
      );
      console.log("token out ", _token1Value);
      if (new BigNumber(_token1Value).gt(0)) {
        setToken1Value(_token1Value);
        // verify swap status with current inputs
        verifySwapStatus(
          { value: _token1Value, selected: selectedToken1 },
          { value: tokens, selected: selectedToken2 }
        );
      }
    } else if (selectedToken1.symbol && !tokens) {
      setToken1Value("");
      if (!swapStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    }
  };

  const onToken1Select = async (token) => {
    setToken1(token);
    verifySwapStatus(
      { value: token1Value, selected: token },
      { value: token2Value, selected: selectedToken2 }
    );
  };

  const onToken2Select = (token) => {
    setToken2(token);

    verifySwapStatus(
      { value: token1Value, selected: selectedToken1 },
      { value: token2Value, selected: token }
    );
  };

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const handleConfirmAllowance = async () => {
    const allowanceAmount = toWei("9999999999");
    await confirmAllowance(
      allowanceAmount,
      selectedToken1,
      currentAccount,
      currentNetwork
    );
  };

  const handleSwapToken = async () => {
    checkPriceImpact();
    setSwapDialog(true);
  };

  const handleSwapConfirm = () => {
    //todo
  };

  const checkPriceImpact = () => {
    let impact;
    if (selectedToken1.symbol === ETH) {
      impact = buyPriceImpact(
        toWei(token2Value),
        poolReserves[selectedToken2.symbol]
      );
    } else {
      impact = sellPriceImpact(
        toWei(token1Value),
        toWei(token2Value),
        poolReserves[selectedToken1.symbol]
      );
    }
    setPriceImpact(impact);
  };

  const hideSnackbar = () => {
    setAlert({ status: false });
  };

  // swap selected tokens and reset inputs
  const handleSwapInputs = () => {
    setRotate(!rotate);
    const tokenSelected1 = selectedToken1;
    setToken1(selectedToken2);
    setToken2(tokenSelected1);

    const tokenInput1 = token1Value;
    setToken1Value(token2Value);
    setToken2Value(tokenInput1);
  };

  const currentTokenApprovalStatus = () => {
    return selectedToken1.symbol === "ETH"
      ? true
      : approvedTokens[selectedToken1.symbol];
  };

  const disableStatus = () => {
    return swapStatus.disabled || localStateLoading;
  };

  const handleAction = () => {
    if (currentTokenApprovalStatus()) {
      handleSwapToken();
    } else {
      handleConfirmAllowance();
    }
  };
  // const handleTokenPriceRatio = () => {};
  const currentButton = () => {
    if (localStateLoading) {
      return "Please wait...";
    } else if (swapStatus.disabled) {
      return swapStatus.message;
    } else if (
      transaction.type === "swap" &&
      transaction.status === "pending"
    ) {
      return "Pending Swap Transaction...";
    } else {
      return !currentTokenApprovalStatus() ? "Approve" : swapStatus.message;
    }
  };

  // swap status updates
  useEffect(() => {
    if (!transaction.hash && !transaction.type) {
      return;
    }

    if (
      transaction.type === "swap" &&
      (transaction.status === "success" || transaction.status === "failed") &&
      !swapDialogOpen
    ) {
      setSwapDialog(true);
    }
  }, [transaction]);

  const handleConfirmSwapClose = (value) => {
    setSwapDialog(value);
    debouncedGetLpBalance(
      selectedToken1,
      selectedToken2,
      currentPairAddress(),
      currentAccount,
      currentNetwork
    );
    if (transaction.type === "swap" && transaction.status === "success") {
      store.dispatch({ type: START_TRANSACTION });
      clearInputState();
    } else if (transaction.type === "swap" && transaction.status === "failed") {
      store.dispatch({ type: START_TRANSACTION });
    }
  };

  return (
    <>
      <TabPage data={0} />

      <CustomSnackBar
        status={snackAlert.status}
        message={snackAlert.message}
        handleClose={hideSnackbar}
      />
      <SwapConfirm
        open={swapDialogOpen}
        handleClose={() => handleConfirmSwapClose(false)}
        selectedToken1={selectedToken1}
        selectedToken2={selectedToken2}
        token1Value={token1Value}
        token2Value={token2Value}
        priceImpact={priceImpact}
        currentSwapFn={currentSwapFn}
      />
      <SwapSettings open={settingOpen} handleClose={close} />
      <Card elevation={20} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.cardHeading}>
            <p>Swap </p>
            <IconButton className={classes.iconButton}>
              <Settings
                fontSize="default"
                onClick={handleSettings}
                className={classes.settingIcon}
              />
            </IconButton>
          </div>

          <SwapCardItem
            inputType="from"
            onInputChange={onToken1InputChange}
            onTokenChange={onToken1Select}
            currentToken={selectedToken1}
            disableToken={selectedToken2}
            inputValue={token1Value}
          />

          <IconButton className={classes.iconButton}>
            {" "}
            <SwapVertIcon
              fontSize="default"
              className={[
                classes.swapIcon,
                rotate ? classes.rotate1 : classes.rotate2,
              ].join(" ")}
              onClick={handleSwapInputs}
            />
          </IconButton>
          <SwapCardItem
            inputType="to"
            onInputChange={onToken2InputChange}
            onTokenChange={onToken2Select}
            currentToken={selectedToken2}
            disableToken={selectedToken1}
            inputValue={token2Value}
          />

          {token1Value && token2Value && (
            <div className="mt-1 d-flex justify-content-end">
              <div className={classes.tokenPrice}>
                <span>
                  {" "}
                  1 {selectedToken1.symbol && selectedToken1.symbol} ={" "}
                  {(token2Value / token1Value).toFixed(2)}{" "}
                  {selectedToken2.symbol && selectedToken2.symbol}
                </span>{" "}
                <Info
                  className={classes.infoIcon}
                  style={{ marginTop: -3 }}
                  onClick={handleTxPoper}
                  onMouseEnter={handleTxPoper}
                  onMouseLeave={() => setAnchorEl(null)}
                />
              </div>
            </div>
          )}
          <Button
            variant="contained"
            disabled={disableStatus()}
            className={classes.swapButton}
            onClick={handleAction}
          >
            {/* {!swapStatus.disabled ? (
              <CircularProgress
                style={{ color: "black" }}
                color="secondary"
                size={30}
              />
            ) : (
              )} */}
            {currentButton()}
          </Button>
        </div>

        <Popper id={id} open={open} anchorEl={anchorEl}>
          <div className={classes.txDetailsCard}>
            <h6 className={classes.txDetailsValue}>
              For each trade a 0.2% fee is paid
            </h6>

            <div className="mt-2">
              <div className={classes.txDetailsValue}>
                - 80% to LP token holders
              </div>
              <div className={classes.txDetailsValue}>
                - 20% to the Treasury, for buyback PBR and burn
              </div>
            </div>
          </div>
        </Popper>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {
  checkAllowance,
  confirmAllowance,
  getLpBalance,
  getAccountBalance,
  loadPairAddress,
})(SwapCard);
