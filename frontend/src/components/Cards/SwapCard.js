import React, { useCallback, useEffect } from "react";
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import TuneIcon from "@material-ui/icons/Tune";
import SwapCardItem from "./SwapCardItem";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import { useState } from "react";
import SwapSettings from "../common/SwapSettings";
import CustomButton from "../Buttons/CustomButton";
import BigNumber from "bignumber.js";
import CustomSnackBar from "../common/CustomSnackbar";
import { ETH, etheriumNetwork, tokens } from "../../constants";
import CachedIcon from "@material-ui/icons/Cached";
import {
  buyPriceImpact,
  fetchTokenAbi,
  fromWei,
  getPercentageAmount,
  getPercentAmount,
  getPriceRatio,
  getTokenOut,
  sellPriceImpact,
  token1PerToken2,
  token2PerToken1,
  toWei,
} from "../../utils/helper";
import {
  swapEthForExactTokens,
  swapExactEthForTokens,
  getTokenPrice,
  checkAllowance,
  confirmAllowance,
  getLpBalance,
  verifySlippage,
  loadPairContractAbi,
} from "../../actions/dexActions";
import { getAccountBalance } from "../../actions/accountActions";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SwapConfirm from "../common/SwapConfirm";
import debounce from "lodash.debounce";
import {
  getPairAbi,
  getPairAddress,
  getTokenAbi,
  getTokenAddress,
} from "../../utils/connectionUtils";
import store from "../../store";
import { SET_TOKEN_ABI } from "../../actions/types";
import { fetchContractAbi } from "../../utils/httpUtils";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 500,
    borderRadius: 15,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
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
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  settingIcon: {
    color: "#f6f6f6",
    transition: "all 0.4s ease",
  },
  iconButton: {
    margin: 0,
    padding: 2,
  },
  swapIcon: {
    color: "#f6f6f6",
    marginTop: 7,
    marginBottom: 7,
    transition: "all 0.4s ease",
  },
  swapButton: {
    marginTop: 20,
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    width: "95%",
    textTransform: "none",
    fontSize: 21,
    borderRadius: 20,
    padding: "12px 50px 12px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
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
}));

const SwapCard = (props) => {
  const {
    account: { currentNetwork, currentAccount },
    dex: {
      swapSettings,
      approvedTokens,
      dexLoading,
      poolReserves,
      tokenData,
      pairContractData,
    },
    swapEthForExactTokens,
    swapExactEthForTokens,
    checkAllowance,
    confirmAllowance,
    tokenType,
    getTokenPrice,
    getLpBalance,
    verifySlippage,
    getAccountBalance,
    loadPairContractAbi,
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

  const updateTokenPrices = async () => {
    console.log("updating...");
    setTimeout(async () => {
      await Promise.all([
        getTokenPrice(0, currentNetwork),
        getTokenPrice(1, currentNetwork),
      ]);
      await updateTokenPrices();
    }, 1000);
  };

  useEffect(async () => {
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

    // check selected from token allowance
    // await checkAllowance(_token, currentAccount, currentNetwork);
  }, [currentNetwork, currentAccount]);

  const currentPairAddress = () => {
    if (
      Object.keys(pairContractData).includes(
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      ].address;
    } else if (
      Object.keys(pairContractData).includes(
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      ].address;
    } else {
      return null;
    }
  };

  const currentPairAbi = () => {
    if (
      Object.keys(pairContractData).includes(
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      ].abi;
    } else if (
      Object.keys(pairContractData).includes(
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      ].abi;
    } else {
      return null;
    }
  };

  useEffect(async () => {
    // if (selectedToken1.symbol && !approvedTokens[selectedToken1.symbol]) {
    //   //skip approve check for eth
    //   // return;
    //   console.log("checking approval in swap");
    //   await checkAllowance(selectedToken1, currentAccount, currentNetwork);
    // }
    if (selectedToken1.symbol && selectedToken2.symbol) {
      // reset token input on token selection

      setToken1Value("");
      setToken2Value("");

      // load erc20 token abi and balance
      const erc20Token =
        selectedToken1.symbol === ETH ? selectedToken2 : selectedToken1;
      let erc20Abi = erc20Token.imported
        ? tokenData[erc20Token.symbol].abi
        : getTokenAbi(erc20Token.symbol);

      if (!erc20Abi) {
        // load token abi if not loaded
        erc20Abi = await fetchTokenAbi(erc20Token.address);
        const abiData = {};
        abiData[`${erc20Token.symbol}`] = erc20Abi;
        store.dispatch({
          type: SET_TOKEN_ABI,
          payload: abiData,
        });
      }
      await getAccountBalance(
        {
          ...erc20Token,
          abi: erc20Abi,
        },
        currentNetwork
      );
      // load current pair ABI
      let _pairAbi = currentPairAbi();

      if (!_pairAbi) {
        _pairAbi = getPairAbi(selectedToken1.symbol, selectedToken2.symbol);
      }

      let _pairAddress = currentPairAddress();
      console.log("current pair address ", _pairAddress);
      if (!_pairAddress) {
        _pairAddress = await getPairAddress(
          selectedToken1.address,
          selectedToken2.address,
          currentNetwork
        );
      }

      if (!_pairAddress) {
        setLiquidityStatus(true);
      } else {
        setLiquidityStatus(false);
      }

      if (!_pairAbi) {
        _pairAbi = await fetchContractAbi(_pairAddress, currentNetwork);
      }
      // laod current pair reserves
      let _pairData = { abi: _pairAbi, address: _pairAddress };

      // update pair data into reducer if not available
      if (!currentPairAddress()) {
        loadPairContractAbi(
          selectedToken1.symbol,
          selectedToken2.symbol,
          _pairData,
          currentNetwork
        );
      }

      console.log("final pair data ", _pairData);
      await getLpBalance(
        selectedToken1,
        selectedToken2,
        _pairData,
        currentAccount,
        currentNetwork
      );

      //   console.log("checking approval in swap");
      // if (!currentTokenApprovalStatus()) {
      await checkAllowance(
        { ...selectedToken1, abi: erc20Abi },
        currentAccount,
        currentNetwork
      );
      // }
    }
  }, [selectedToken1, selectedToken2, currentNetwork, currentAccount]);

  const verifySwapStatus = (token1, token2) => {
    let message, disabled;
    const _token1 = new BigNumber(token1.value ? token1.value : 0);
    const _token2 = new BigNumber(token2.value ? token2.value : 0);

    if (token1.selected.symbol === token2.selected.symbol) {
      message = "Invalid pair";
      disabled = true;
    } else if (
      (_token1.eq("0") && token1.selected.symbol) ||
      (_token2.eq("0") && token2.selected.symbol)
    ) {
      message = "Enter amounts";
      disabled = true;
    } else if (!token1.selected.symbol || !token2.selected.symbol) {
      message = "Select both tokens";
      disabled = true;
    } else if (
      _token1.gt("0") &&
      _token2.gt("0") &&
      token1.selected.symbol &&
      token2.selected.symbol
    ) {
      message = "";
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

    // calculate resetpective value of token 2 if selected
    let _token2Value = "";
    if (selectedToken2.symbol && tokens) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        currentAccount,
        currentNetwork
      );

      //input tokens will be 99.8% of input value 0.2% will be deducted for fee
      const _withoutFeeInputToken = getPercentageAmount(tokens, 99.8);
      _token2Value = getTokenOut(
        _withoutFeeInputToken,
        poolReserves[selectedToken2.symbol],
        poolReserves[selectedToken1.symbol]
      );
      if (new BigNumber(_token2Value).gt(0)) {
        setToken2Value(_token2Value);
      }
    } else if (selectedToken2.symbol && !tokens) {
      setToken2Value("");
    }

    // verify swap status with current inputs
    verifySwapStatus(
      { value: tokens, selected: selectedToken1 },
      { value: _token2Value, selected: selectedToken2 }
    );
  };

  const onToken2InputChange = async (tokens) => {
    setToken2Value(tokens);

    //calculate respective value of token1 if selected
    let _token1Value = "";
    if (selectedToken1.symbol && tokens) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        currentAccount,
        currentNetwork
      );

      _token1Value = getTokenOut(
        tokens,
        poolReserves[selectedToken1.symbol],
        poolReserves[selectedToken2.symbol]
      );
      if (new BigNumber(_token1Value).gt(0)) {
        setToken1Value(_token1Value);
      }
    } else if (selectedToken1.symbol && !tokens) {
      setToken1Value("");
    }

    // verify swap status with current inputs
    verifySwapStatus(
      { value: token1Value, selected: selectedToken1 },
      { value: tokens, selected: selectedToken2 }
    );
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

    verifySlippage(
      swapSettings.slippage,
      { ...selectedToken1, amount: token1Value },
      { ...selectedToken2, amount: token2Value },
      currentAccount,
      currentNetwork
    );
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

  const isBothTokenSelected = () => {
    if (selectedToken1.symbol && selectedToken2.symbol) {
      return true;
    }
    return false;
  };

  // const handleTokenPriceRatio = () => {};

  return (
    <>
      <CustomSnackBar
        status={snackAlert.status}
        message={snackAlert.message}
        handleClose={hideSnackbar}
      />
      <SwapConfirm
        open={swapDialogOpen}
        handleClose={() => setSwapDialog(false)}
        selectedToken1={selectedToken1}
        selectedToken2={selectedToken2}
        token1Value={token1Value}
        token2Value={token2Value}
        priceImpact={priceImpact}
      />
      <SwapSettings open={settingOpen} handleClose={close} />
      <Card elevation={20} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.cardHeading}>
            <p>Swap </p>
            <IconButton className={classes.iconButton}>
              <TuneIcon
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
          {/* <div className={classes.priceRatio}>
              <small>Price</small>
              <small>41,250 PBR per ETH </small>
              <CachedIcon
                onClick={handleTokenPriceRatio}
                className={classes.resetIcon}
                fontSize="small"
              />
            </div> */}
          {!swapStatus.disabled && !liquidityStatus && !dexLoading ? (
            <div className="d-flex justify-content-around w-100 mt-4 mb-1 ">
              <span>Price</span>
              <span>
                1 {selectedToken1.symbol} {" = "}{" "}
                {getPriceRatio(
                  poolReserves[selectedToken2.symbol],
                  poolReserves[selectedToken1.symbol]
                )}{" "}
                {selectedToken2.symbol}
              </span>
            </div>
          ) : liquidityStatus ? (
            "No liquidity availabe for this pair"
          ) : (
            ""
          )}
          <Button variant="contained" className={classes.swapButton}>
            Swap
          </Button>

          {/* <div className="d-flex  mt-4">
            <CustomButton
              variant="light"
              className={classes.approveBtn}
              disabled={
                currentTokenApprovalStatus() ||
                dexLoading ||
                !isBothTokenSelected() ||
                liquidityStatus
              }
              onClick={handleConfirmAllowance}
            >
              {currentTokenApprovalStatus() && isBothTokenSelected() ? (
                <>
                  Approved{" "}
                  <CheckCircleIcon
                    style={{ color: "#E0077D", marginLeft: 5 }}
                    fontSize="small"
                  />{" "}
                </>
              ) : dexLoading ? (
                <CircularProgress
                  style={{ color: "black" }}
                  color="secondary"
                  size={30}
                />
              ) : (
                "Approve"
              )}
            </CustomButton>

            <CustomButton
              variant="primary"
              // className={classes.addButton}
              disabled={swapStatus.disabled | dexLoading || liquidityStatus}
              onClick={handleSwapToken}
            >
              {!swapStatus.disabled && dexLoading ? (
                <CircularProgress
                  style={{ color: "black" }}
                  color="secondary"
                  size={30}
                />
              ) : (
                "Swap"
              )}
            </CustomButton>
          </div>
           */}
          {/* <CustomButton
              variant="light"
              className={classes.addButton}
              onClick={
                !approvedTokens[selectedToken1.symbol]
                  ? handleConfirmAllowance
                  : handleSwapToken
              }
              disabled={
                !approvedTokens[selectedToken1.symbol]
                  ? false
                  : swapStatus.disabled
              }
            >
              {!approvedTokens[selectedToken1.symbol]
                ? `Approve ${selectedToken1.symbol} tokens`
                : swapStatus.message}
            </CustomButton> */}
        </div>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {
  getTokenPrice,
  swapEthForExactTokens,
  swapExactEthForTokens,
  checkAllowance,
  confirmAllowance,
  getLpBalance,
  verifySlippage,
  getAccountBalance,
  loadPairContractAbi,
})(SwapCard);
