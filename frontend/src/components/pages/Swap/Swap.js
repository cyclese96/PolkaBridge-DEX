import React, { useCallback, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  IconButton,
  makeStyles,
  Popper,
} from "@material-ui/core";
import { connect } from "react-redux";
import SwapCardItem from "../../Cards/SwapCardItem";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import { useState } from "react";
import SwapSettings from "../../common/SwapSettings";
import BigNumber from "bignumber.js";
import {
  allowanceAmount,
  defaultSwapInputToken,
  ETH,
  swapFnConstants,
  THRESOLD_VALUE,
} from "../../../constants";
import {
  fromWei,
  getPriceRatio,
  getTokenToSelect,
  toWei,
} from "../../../utils/helper";
import {
  calculatePriceImpact,
  checkAllowance,
  confirmAllowance,
  getLpBalance,
  getToken0InAmount,
  getToken1OutAmount,
  importToken,
} from "../../../actions/dexActions";
import { getAccountBalance } from "../../../actions/accountActions";
import TransactionConfirm from "../../common/TransactionConfirm";
import debounce from "lodash.debounce";

import { Info, Settings } from "@material-ui/icons";
import TabPage from "../../TabPage";
import store from "../../../store";
import {
  HIDE_DEX_LOADING,
  SHOW_DEX_LOADING,
  START_TRANSACTION,
} from "../../../actions/types";
import { default as NumberFormat } from "react-number-format";
import { useLocation } from "react-router";
import { usePrevious } from "react-use";
import { useTokenData } from "../../../contexts/TokenData";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 500,
    borderRadius: 30,
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      width: "96%",
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardHeading: {
    width: "95%",
    paddingBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  settingIcon: {
    color: theme.palette.primary.iconColor,
    fontSize: 22,
    cursor: "pointer",
    transition: "all 0.4s ease",
    [theme.breakpoints.down("sm")]: {
      fontSize: 22,
    },
  },
  iconButton: {
    margin: 0,
    padding: 2,
    backgroundColor: theme.palette.primary.iconBack,
    borderRadius: "30%",
  },
  swapIcon: {
    color: theme.palette.primary.iconColor,
    marginTop: -12,
    marginBottom: -12,
    borderRadius: "36%",
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: theme.palette.primary.iconBack,
    transition: "all 0.4s ease",
    fontSize: 28,
    backgroundColor: theme.palette.primary.iconBack,
  },
  swapButton: {
    marginTop: 30,
    backgroundColor: theme.palette.primary.pbr,
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
  priceRatio: {
    display: "flex",
    width: "70%",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 30,
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
  heading: {
    color: theme.palette.textColors.heading,
    letterSpacing: -0.7,
    fontSize: 18,
    fontWeight: 500,
  },
  certikLabel: {
    textAlign: "center",
    color: theme.palette.primary.iconColor,
    fontWeight: 600,
    fontSize: 14,
    paddingTop: 3,
    // marginBottom: 4,
  },
  ankrLabel: {
    textAlign: "center",
    color: theme.palette.primary.iconColor,
    fontSize: 12,
    paddingTop: 3,
  },
  hackenLabel: {
    textAlign: "center",
    color: "#50DDA0",
    fontSize: 12,
    paddingTop: 3,
  },
  icon: {
    width: 25,
    height: "100%",
  },
}));

const Swap = (props) => {
  const {
    account: { currentNetwork, currentAccount, loading, balance, connected },
    dex: {
      approvedTokens,
      transaction,
      token0In,
      token1Out,
      priceLoading,
      tokenList,
    },
    checkAllowance,
    confirmAllowance,
    getLpBalance,
    getAccountBalance,
    getToken0InAmount,
    getToken1OutAmount,
    importToken,
  } = props;

  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);

  const [selectedToken0, setToken1] = useState({});

  const [selectedToken1, setToken2] = useState({});
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
  const [localStateLoading, setLocalStateLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [priceRatio, setPriceRatio] = useState(null);

  const handleTxPoper = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [currentSwapFn, setCurrentSwapFn] = useState(
    swapFnConstants.swapExactETHForTokens
  );
  const [swapPath, setSwapPath] = useState([]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const query = new URLSearchParams(useLocation().search);

  const [token0Query, token1Query] = [
    query.get("inputCurrency"),
    query.get("outputCurrency"),
  ];

  useEffect(() => {
    async function initSelection() {
      if (!tokenList || !currentAccount || !currentNetwork) {
        return;
      }

      setLocalStateLoading(true);

      if (token0Query) {
        const _token = getTokenToSelect(tokenList, token0Query);

        if (!_token || !_token.symbol) {
          importToken(token0Query, currentAccount, currentNetwork);
        }
        setToken1(_token);
      } else {
        const _token = getTokenToSelect(
          tokenList,
          defaultSwapInputToken?.[currentNetwork]
        );
        setToken1(_token);
      }

      if (token1Query) {
        const _token = getTokenToSelect(tokenList, token1Query);

        if (!_token || !_token.symbol) {
          importToken(token1Query, currentAccount, currentNetwork);
        }

        setToken2(_token);
      }

      setToken1Value("");
      setToken2Value("");
      setLocalStateLoading(false);
    }
    initSelection();
  }, [currentNetwork, currentAccount, tokenList]);

  const clearInputState = () => {
    setToken1Value("");
    setToken2Value("");
    setStatus({ disabled: true, message: "Enter Amounts" });
  };

  useEffect(() => {
    async function loadPair() {
      setLocalStateLoading(true);

      if (!selectedToken0.symbol || !selectedToken1.symbol) {
        localStorage.priceTracker = "None";
        clearInputState();
      }

      if (selectedToken0.symbol) {
        await getAccountBalance(selectedToken0, currentNetwork);
      }

      if (selectedToken1.symbol) {
        await getAccountBalance(selectedToken1, currentNetwork);
      }

      if (selectedToken0.symbol && selectedToken1.symbol) {
        // reset token input on token selection
        clearInputState();

        await checkAllowance(selectedToken0, currentAccount, currentNetwork);

        setLocalStateLoading(false);
      }
    }
    loadPair();
    setLocalStateLoading(false);
  }, [selectedToken0, selectedToken1, currentNetwork, currentAccount]);

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

  // const debouncedGetLpBalance = useCallback(
  //   debounce((...params) => getLpBalance(...params), 1000),
  //   [] // will be created only once initially
  // );

  const debouncedToken1OutCall = useCallback(
    debounce((...params) => getToken1OutAmount(...params), 1000),
    [] // will be created only once initially
  );

  const debouncedToken0InCall = useCallback(
    debounce((...params) => getToken0InAmount(...params), 1000),
    [] // will be created only once initially
  );

  const token1OutCalling = "token1OutCalling";
  const token0InCalling = "token0InCalling";

  // token 1 input change
  const onToken1InputChange = async (tokens) => {
    setToken1Value(tokens);

    localStorage.priceTracker = token1OutCalling;

    if (selectedToken0.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapExactETHForTokens);
    } else if (selectedToken1.symbol && selectedToken1.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapExactTokensForETH);
    } else {
      setCurrentSwapFn(swapFnConstants.swapExactTokensForTokens);
    }

    // calculate resetpective value of token 2 if selected
    // let _token2Value = "";
    // const pairAddress = currentPairAddress();

    if (selectedToken1.symbol && new BigNumber(tokens).gt(0)) {
      debouncedToken1OutCall(
        { ...selectedToken0, amount: toWei(tokens, selectedToken0.decimals) },
        selectedToken1,
        currentAccount,
        currentNetwork
      );
    } else if (selectedToken1.symbol && !tokens) {
      setToken2Value("");
      if (!swapStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    }
  };

  // token2 input change
  const onToken2InputChange = async (tokens) => {
    setToken2Value(tokens);

    localStorage.priceTracker = token0InCalling;

    if (selectedToken0.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapETHforExactTokens);
    } else if (selectedToken1.symbol && selectedToken1.symbol === ETH) {
      setCurrentSwapFn(swapFnConstants.swapTokensForExactETH);
    } else {
      setCurrentSwapFn(swapFnConstants.swapTokensForExactTokens);
    }

    //calculate respective value of token1 if selected

    if (selectedToken0.symbol && new BigNumber(tokens).gt(0)) {
      debouncedToken0InCall(
        selectedToken0,
        { ...selectedToken1, amount: toWei(tokens, selectedToken1.decimals) },
        currentAccount,
        currentNetwork
      );
    } else if (selectedToken0.symbol && !tokens) {
      setToken1Value("");
      if (!swapStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    }
  };

  //On tonen0 input: price update checks and output result updates
  const prevToken1Out = usePrevious(token2Value);
  useEffect(() => {
    if (!token1Out) {
      return;
    }

    if (localStorage.getItem("priceTracker") !== token1OutCalling) {
      return;
    }

    const _tokenAmount = token1Out.tokenAmount;
    if (new BigNumber(_tokenAmount).eq(prevToken1Out)) {
      return;
    }

    setSwapPath(token1Out.selectedPath);

    if (new BigNumber(_tokenAmount).gt(0)) {
      setToken2Value(_tokenAmount);
      // verify swap status with current inputs
      verifySwapStatus(
        { value: token1Value, selected: selectedToken0 },
        { value: _tokenAmount, selected: selectedToken1 }
      );
    }

    // balance check before trade
    const _bal0 = Object.keys(balance).includes(selectedToken0.symbol)
      ? balance[selectedToken0.symbol]
      : 0;
    const bal0Wei = fromWei(_bal0, selectedToken0.decimals);
    if (new BigNumber(token1Value).gt(bal0Wei)) {
      setStatus({
        disabled: true,
        message: "Insufficient funds!",
      });
    }

    if (new BigNumber(_tokenAmount).lt(THRESOLD_VALUE)) {
      setStatus({
        disabled: true,
        message: "Not enough liquidity for this trade!",
      });
    }

    // update current price ratio based on trade amounts
    const _ratio = getPriceRatio(_tokenAmount, token1Value);
    setPriceRatio(_ratio);

    // price update tracker on every 1 sec interval
    setTimeout(async () => {
      if (
        localStorage.getItem("priceTracker") === token1OutCalling &&
        selectedToken0.symbol &&
        selectedToken1.symbol &&
        new BigNumber(token1Value).gt(0)
      ) {
        const token1OutParams = [
          {
            ...selectedToken0,
            amount: toWei(token1Value, selectedToken0.decimals),
          },
          selectedToken1,
          currentAccount,
          currentNetwork,
        ];

        await debouncedToken1OutCall(...token1OutParams);
      }
    }, 1000);
  }, [token1Out]);

  //On token1 input: price update checks and output result updates
  const prevToken0In = usePrevious(token1Value);
  useEffect(() => {
    if (!token0In) {
      return;
    }

    if (localStorage.getItem("priceTracker") !== token0InCalling) {
      return;
    }

    const _tokenAmount = token0In.tokenAmount;
    if (new BigNumber(_tokenAmount).eq(prevToken0In)) {
      return;
    }

    setSwapPath(token0In.selectedPath);

    if (new BigNumber(_tokenAmount).gt(0)) {
      setToken1Value(_tokenAmount);
      // verify swap status with current inputs
      verifySwapStatus(
        { value: _tokenAmount, selected: selectedToken0 },
        { value: token2Value, selected: selectedToken1 }
      );
    }

    // balance check before trade
    const _bal0 = Object.keys(balance).includes(selectedToken0.symbol)
      ? balance[selectedToken0.symbol]
      : 0;

    const bal0Wei = fromWei(_bal0, selectedToken0.decimals);

    if (new BigNumber(_tokenAmount).gt(bal0Wei)) {
      setStatus({
        disabled: true,
        message: "Insufficient funds!",
      });
    }

    if (new BigNumber(_tokenAmount).lt(THRESOLD_VALUE)) {
      setStatus({
        disabled: true,
        message: "Not enough liquidity for this trade!",
      });
    }

    // update current price ratio based on trade amounts
    const _ratio = getPriceRatio(token2Value, _tokenAmount);
    setPriceRatio(_ratio);

    // price update tracker on every 1 sec interval
    setTimeout(async () => {
      if (
        localStorage.getItem("priceTracker") === token0InCalling &&
        selectedToken0.symbol &&
        selectedToken1.symbol &&
        new BigNumber(token2Value).gt(0)
      ) {
        const token0InParams = [
          selectedToken0,
          {
            ...selectedToken1,
            amount: toWei(token2Value, selectedToken1.decimals),
          },
          currentAccount,
          currentNetwork,
        ];

        await debouncedToken0InCall(...token0InParams);
      }
    }, 1000);
  }, [token0In]);

  const token0PriceData = useTokenData(
    selectedToken0.address ? selectedToken0.address.toLowerCase() : null
  );
  const token1PriceData = useTokenData(
    selectedToken1.address ? selectedToken1.address.toLowerCase() : null
  );
  // selected token usd value track
  const token0PriceUsd = useMemo(() => {
    if (!selectedToken0?.symbol || !token0PriceData) {
      return 0;
    }

    return token0PriceData?.priceUSD;
  }, [token0PriceData]);

  const token1PriceUsd = useMemo(() => {
    if (!selectedToken1?.symbol || !token1PriceData) {
      return 0;
    }

    return token1PriceData?.priceUSD;
  }, [token1PriceData]);

  const onToken1Select = async (token) => {
    setToken1(token);
    verifySwapStatus(
      { value: token1Value, selected: token },
      { value: token2Value, selected: selectedToken1 }
    );
  };

  const onToken2Select = (token) => {
    setToken2(token);

    verifySwapStatus(
      { value: token1Value, selected: selectedToken0 },
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
    const _allowanceAmount = allowanceAmount;
    await confirmAllowance(
      _allowanceAmount,
      selectedToken0,
      currentAccount,
      currentNetwork
    );
  };

  const handleSwapToken = async () => {
    checkPriceImpact();
    setSwapDialog(true);
  };

  const checkPriceImpact = async () => {
    let impact;

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

    store.dispatch({ type: SHOW_DEX_LOADING });
    impact = await calculatePriceImpact(
      token0,
      token1,
      currentAccount,
      currentNetwork
    );
    store.dispatch({ type: HIDE_DEX_LOADING });

    console.log("price impact ", impact);
    setPriceImpact(impact);
  };

  // const hideSnackbar = () => {
  //   setAlert({ status: false });
  // };

  // swap selected tokens and reset inputs
  const handleSwapInputs = () => {
    localStorage.priceTracker = "None";

    setRotate(!rotate);
    const tokenSelected1 = selectedToken0;
    setToken1(selectedToken1);
    setToken2(tokenSelected1);

    const tokenInput1 = token1Value;
    setToken1Value(token2Value);
    setToken2Value(tokenInput1);
  };

  const currentTokenApprovalStatus = () => {
    return selectedToken0.symbol === "ETH"
      ? true
      : approvedTokens[selectedToken0.symbol];
  };

  const disableStatus = () => {
    if (!connected) {
      return true;
    }

    return swapStatus.disabled || localStateLoading || priceLoading;
  };

  const handleAction = () => {
    if (currentTokenApprovalStatus()) {
      handleSwapToken();
    } else {
      handleConfirmAllowance();
    }
  };

  const currentButton = () => {
    if (!connected) {
      return "Connect Wallet";
    }

    if (localStateLoading || priceLoading) {
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

  // swap transaction status update
  useEffect(() => {
    if (!transaction.hash && !transaction.type) {
      return;
    }

    if (transaction.type === "swap" && transaction.status === "success") {
      localStorage.priceTracker = "None";
      getAccountBalance(selectedToken0, currentNetwork);
      getAccountBalance(selectedToken1, currentNetwork);
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

      <TransactionConfirm
        open={swapDialogOpen}
        handleClose={() => handleConfirmSwapClose(false)}
        selectedToken0={selectedToken0}
        selectedToken1={selectedToken1}
        token1Value={token1Value}
        token2Value={token2Value}
        priceImpact={priceImpact}
        currentSwapFn={currentSwapFn}
        currenSwapPath={swapPath}
        priceRatio={priceRatio}
      />
      <SwapSettings open={settingOpen} handleClose={close} />
      <Card elevation={20} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.cardHeading}>
            <h6 className={classes.heading}>Swap </h6>
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
            currentToken={selectedToken0}
            disableToken={selectedToken1}
            inputValue={token1Value}
            priceUSD={token0PriceUsd}
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
            currentToken={selectedToken1}
            disableToken={selectedToken0}
            inputValue={token2Value}
            priceUSD={token1PriceUsd}
          />

          {token1Value && token2Value && (
            <div
              className="mt-2 d-flex justify-content-end"
              style={{ width: "95%" }}
            >
              <div className={classes.tokenPrice}>
                {selectedToken0.symbol &&
                selectedToken1.symbol &&
                !disableStatus() ? (
                  <span style={{ paddingRight: 5 }}>
                    1 {selectedToken0.symbol} {" = "}
                    <NumberFormat
                      displayType="text"
                      value={priceRatio}
                      decimalScale={5}
                    />{" "}
                    {selectedToken1.symbol}
                  </span>
                ) : (
                  ""
                )}

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
            disabled={disableStatus()}
            className={classes.swapButton}
            onClick={handleAction}
          >
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
  getToken0InAmount,
  getToken1OutAmount,
  importToken,
})(Swap);
