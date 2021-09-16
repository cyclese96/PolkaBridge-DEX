import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useCallback, useEffect, useState } from "react";
import SwapSettings from "../../common/SwapSettings";
import etherImg from "../../../assets/ether.png";
import SwapCardItem from "../../Cards/SwapCardItem";
import AddIcon from "@material-ui/icons/Add";
import { ETH, etheriumNetwork, tokens } from "../../../constants";
import {
  getPercentage,
  getPriceRatio,
  getTokenOut,
  toWei,
} from "../../../utils/helper";
import {
  addLiquidityEth,
  checkAllowance,
  confirmAllowance,
  getPoolShare,
  getLpBalance,
  loadPairContractAbi,
} from "../../../actions/dexActions";
import { getAccountBalance } from "../../../actions/accountActions";
import tokenThumbnail from "../../../utils/tokenThumbnail";
import BigNumber from "bignumber.js";
import store from "../../../store";
import { RESET_POOL_SHARE, SET_TOKEN_ABI } from "../../../actions/types";
import debounce from "lodash.debounce";
import { getPairAddress, getTokenAbi } from "../../../utils/connectionUtils";
import { fetchContractAbi } from "../../../utils/httpUtils";
import { Settings } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 500,
    borderRadius: 15,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 20,
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
    paddingTop: 5,
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 0,
    },
  },
  cardFeature: {
    marginTop: 10,
    marginBottom: 10,
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSubHeading: {
    color: "#ffffff",
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 2,
  },
  settingIcon: {
    color: "#f6f6f6",
    fontSize: 22,
    [theme.breakpoints.down("sm")]: {
      fontSize: 17,
    },
  },
  addIcon: {
    color: "#f6f6f6",
    marginTop: -12,
    marginBottom: -12,
    borderRadius: "36%",
    border: "3px solid #212121",
    transition: "all 0.4s ease",
    fontSize: 28,
    backgroundColor: "#191B1E",
  },

  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  tokenPair: {
    display: "flex",
    width: "94%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
  },
  selectToken: {
    width: 150,
  },
  checkIcon: {
    color: "#E0077D",
  },
  selectPoolContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  feeSelectContainer: {
    width: 140,
    padding: 6,
    marginLeft: 5,
    marginRight: 5,
    border: "0.5px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      width: 90,
      padding: 2,
      paddingLeft: 5,
      marginLeft: 2,
      marginRight: 2,
    },
  },
  feeSelectHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 15,
    fontWeight: 500,
    color: "#e5e5e5",
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
  feeSelectHeadingSpan: {
    color: "#fce4ec",
    fontSize: 11,
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
  },
  priceRangeCardContainer: {
    display: "flex",
    width: "90%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
  },

  addButton: {
    height: 45,
    width: "90%",
    marginTop: 30,
    marginBottom: 5,
  },
  clearButton: {
    color: "#E0077D",
    cursor: "pointer",
    fontSize: 16,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  title: {
    paddingTop: 5,
    fontSize: 16,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  cardTitle: {
    fontSize: 16,
    color: "#bdbdbd",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  hintStyle: {
    fontSize: 13,
    color: "#e5e5e5",
    marginTop: 20,
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
      fontSize: 11,
    },
  },
  iconButton: {
    margin: 0,
    padding: 2,
  },
  addLiquidityButton: {
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
    padding: "10px 50px 10px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: 5,
      fontSize: 13,
    },
  },
}));

const AddCard = (props) => {
  const {
    account: { balance, loading, currentNetwork, currentAccount },
    dex: {
      swapSettings,
      approvedTokens,
      poolShare,
      poolReserves,
      pairContractData,
      tokenData,
    },
    addLiquidityEth,
    checkAllowance,
    confirmAllowance,
    getPoolShare,
    handleBack,
    getLpBalance,
    loadPairContractAbi,
    getAccountBalance,
  } = props;

  const currentDefaultToken = {
    icon: etherImg,
    name: "Ethereum",
    symbol: "ETH",
  };
  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState(currentDefaultToken);
  const [selectedToken2, setToken2] = useState({});
  const [token1Value, setToken1Value] = useState(""); // token1 for eth only
  const [token2Value, setToken2Value] = useState(""); // token2 for pbr

  const [addStatus, setStatus] = useState({
    message: "Please select tokens",
    disabled: true,
  });

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  useEffect(async () => {
    let defaultToken1, defaultToken2;
    if (currentNetwork === etheriumNetwork) {
      defaultToken1 = tokens[0];
      defaultToken2 = tokens[2];
    } else {
      defaultToken1 = {
        icon: tokenThumbnail("PWAR"),
        name: "Polkawar",
        symbol: "PWAR",
      };
      defaultToken2 = {
        icon: tokenThumbnail("BNB"),
        name: "Binance",
        symbol: "BNB",
      };
    }
    setToken1(defaultToken1);
    setToken2(defaultToken2);
    verifySwapStatus(
      { value: token1Value, selected: defaultToken1 },
      { value: token2Value, selected: defaultToken2 }
    );
  }, [currentNetwork]);

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

  const currentTokenApprovalStatus = () => {
    return selectedToken1.symbol === "ETH"
      ? true
      : approvedTokens[selectedToken1.symbol];
  };

  const getSelectedTokenAbi = (token) => {
    let abi = getTokenAbi(token.symbol);
    if (!abi) {
      abi = tokenData[token.symbol] ? tokenData[token.symbol] : null;
    }
    console.log("returing abi ", tokenData[token.symbol]);
    return abi;
  };

  const clearInputState = () => {
    setToken1Value("");
    setToken2Value("");
    setStatus({ disabled: true, message: "Enter Amounts" });
  };

  // new use effect
  useEffect(async () => {
    if (selectedToken1.symbol && selectedToken2.symbol) {
      clearInputState();
      // load erc20 token abi and balance
      const erc20Token =
        selectedToken1.symbol === ETH ? selectedToken2 : selectedToken1;
      let erc20Abi = getSelectedTokenAbi(erc20Token);
      console.log("abi received ", erc20Abi);
      if (!erc20Abi) {
        // load token abi if not loaded
        erc20Abi = await fetchContractAbi(erc20Token.address, currentNetwork);
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

      let _pairAddress = currentPairAddress();
      console.log("current pair address ", _pairAddress);
      if (!_pairAddress) {
        _pairAddress = await getPairAddress(
          selectedToken1.address,
          selectedToken2.address,
          currentNetwork
        );
        console.log(
          "pair address not found fetched from factory ",
          _pairAddress
        );
      }

      if (!_pairAddress) {
        //pair not yet created in the factory
      } else {
        // load current pair ABI
        let _pairAbi = currentPairAbi();

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
      }

      // if (!currentTokenApprovalStatus()) {
      await checkAllowance(
        { ...selectedToken1, abi: erc20Abi },
        currentAccount,
        currentNetwork
      );
      // }
    }
  }, [selectedToken1, selectedToken2, currentNetwork, currentAccount]);

  const handleConfirmAllowance = async () => {
    // console.log("token", selectedToken1.symbol);
    // console.log("abi", getSelectedTokenAbi(selectedToken1));
    const allowanceAmount = toWei("999999999");
    const tokenAbi = getSelectedTokenAbi(selectedToken1);
    // console.log("abi", tokenData[selectedToken1.symbol].abi);
    await confirmAllowance(
      allowanceAmount,
      { ...selectedToken1, abi: tokenAbi },
      currentAccount,
      currentNetwork
    );
  };

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
      message = "Add liquidity ";
      disabled = false;
    }

    setStatus({ message, disabled });

    if (!disabled) {
      debouncedPoolShareCall(
        selectedToken1.symbol,
        selectedToken2.symbol,
        token1.value,
        token2.value,
        currentNetwork
      );
    }
  };

  const debouncedPoolShareCall = useCallback(
    debounce((...params) => getPoolShare(...params), 1000),
    [] // will be created only once initially
  );

  const debouncedGetLpBalance = useCallback(
    debounce((...params) => getLpBalance(...params), 1000),
    [] // will be created only once initially
  );

  const getCurrentPairData = () => {
    const pairData = { abi: currentPairAbi(), address: currentPairAddress() };
    return pairData;
  };

  const onToken1InputChange = async (tokens) => {
    setToken1Value(tokens);

    //calculate resetpective value of token 2 if selected
    let _token2Value = "";
    const pairData = getCurrentPairData();

    if (selectedToken2.symbol && tokens && pairData.abi && pairData.address) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        pairData,
        currentAccount,
        currentNetwork
      );

      _token2Value = getTokenOut(
        tokens,
        poolReserves[selectedToken2.symbol],
        poolReserves[selectedToken1.symbol]
      );
      if (new BigNumber(_token2Value).gt(0)) {
        setToken2Value(_token2Value);
        verifySwapStatus(
          { value: tokens, selected: selectedToken1 },
          { value: _token2Value, selected: selectedToken2 }
        );
      }
    } else if (selectedToken2.symbol && !tokens) {
      setToken2Value("");
      if (!addStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    } else if (selectedToken2.symbol && tokens) {
      // setStatus({ disabled: false, message: "Add Liquidity" });
      verifySwapStatus(
        { value: tokens, selected: selectedToken1 },
        { value: token2Value, selected: selectedToken2 }
      );
    }
  };

  const onToken2InputChange = async (tokens) => {
    setToken2Value(tokens);

    let _token1Value = "";
    const pairData = getCurrentPairData();

    if (selectedToken1.symbol && tokens && pairData.abi && pairData.address) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        pairData,
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
        verifySwapStatus(
          { value: _token1Value, selected: selectedToken1 },
          { value: tokens, selected: selectedToken2 }
        );
      }
    } else if (selectedToken1.symbol && !tokens) {
      setToken1Value("");
      if (!addStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    } else if (selectedToken1.symbol && tokens) {
      // setStatus({ disabled: false, message: "Add Liquidity" });
      verifySwapStatus(
        { value: token1Value, selected: selectedToken1 },
        { value: tokens, selected: selectedToken2 }
      );
    }
  };

  const resetInput = () => {
    setToken1Value("0");
    setToken2Value("0");
    store.dispatch({ type: RESET_POOL_SHARE });
  };

  const onToken1Select = (token) => {
    setToken1(token);
    resetInput();

    verifySwapStatus(
      { value: "0", selected: token },
      { value: "0", selected: selectedToken2 }
    );
  };
  const onToken2Select = (token) => {
    setToken2(token);
    resetInput();

    verifySwapStatus(
      { value: "0", selected: selectedToken1 },
      { value: "0", selected: token }
    );
  };

  const handleClearState = () => {
    resetInput();

    verifySwapStatus(
      { value: "", selected: selectedToken1 },
      { value: "", selected: selectedToken2 }
    );
  };

  const handleAddLiquidity = async () => {
    let etherToken, erc20Token;
    if (selectedToken1.symbol === ETH) {
      etherToken = {
        ...selectedToken1,
        amount: token1Value.toString(),
      };
      erc20Token = {
        ...selectedToken2,
        amount: toWei(token2Value.toString()),
      };
    } else {
      etherToken = {
        ...selectedToken2,
        amount: token2Value.toString(),
      };
      erc20Token = {
        ...selectedToken1,
        amount: toWei(token1Value.toString()),
      };
    }

    await addLiquidityEth(
      etherToken,
      erc20Token,
      currentAccount,
      swapSettings.deadline,
      currentNetwork
    );
  };

  const currentPoolShare = () => {
    if (
      !poolReserves[selectedToken1.symbol] ||
      !poolReserves[selectedToken2.symbol]
    ) {
      return "100";
    }
    const token1Amount = toWei(token1Value);
    const token1Reserves = new BigNumber(poolReserves[selectedToken1.symbol]);
    const share = getPercentage(
      token1Amount,
      token1Reserves.plus(token1Amount).toString()
    );
    return share;
  };

  const disableStatus = () => {
    return addStatus.disabled;
  };

  const handleAction = () => {
    if (currentTokenApprovalStatus()) {
      handleAddLiquidity();
    } else {
      handleConfirmAllowance();
    }
  };
  // const handleTokenPriceRatio = () => {};
  const currentButton = () => {
    if (addStatus.disabled) {
      return addStatus.message;
    } else {
      return !currentTokenApprovalStatus() ? "Approve" : addStatus.message;
    }
  };

  return (
    <>
      <SwapSettings open={settingOpen} handleClose={close} />
      <Card elevation={20} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.cardHeading}>
            <IconButton onClick={handleBack} style={{ margin: 0, padding: 0 }}>
              <KeyboardBackspaceIcon
                fontSize="default"
                className={classes.settingIcon}
              />
            </IconButton>
            <h6 className={classes.title}>Add Liquidity</h6>
            <IconButton
              onClick={handleSettings}
              style={{ margin: 0, padding: 0 }}
            >
              <Settings fontSize="default" className={classes.settingIcon} />
            </IconButton>
          </div>

          <div className={classes.cardFeature}>
            <span className={classes.cardTitle}>Select pair</span>
            <span className={classes.clearButton} onClick={handleClearState}>
              Clear all
            </span>
          </div>

          <SwapCardItem
            onInputChange={onToken1InputChange}
            onTokenChange={onToken1Select}
            currentToken={selectedToken1}
            disableToken={selectedToken2}
            inputValue={token1Value}
          />
          <IconButton className={classes.iconButton}>
            <AddIcon fontSize="default" className={classes.addIcon} />
          </IconButton>

          <SwapCardItem
            onInputChange={onToken2InputChange}
            onTokenChange={onToken2Select}
            currentToken={selectedToken2}
            disableToken={selectedToken1}
            inputValue={token2Value}
          />

          {selectedToken1.symbol && selectedToken2.symbol ? (
            <div style={{ width: "95%" }}>
              <div className={classes.cardSubHeading}>
                <span className={classes.hintStyle}>Prices and Pool share</span>
              </div>

              <div className={classes.selectPoolContainer}>
                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {getPriceRatio(token1Value, token2Value)}
                  </div>
                  <span className={classes.feeSelectHeadingSpan}>
                    {`${selectedToken1.symbol} per ${selectedToken2.symbol}`}
                  </span>
                </div>

                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {getPriceRatio(token2Value, token1Value)}
                  </div>
                  <span className={classes.feeSelectHeadingSpan}>
                    {`${selectedToken2.symbol} per ${selectedToken1.symbol}`}
                  </span>
                </div>

                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {`${currentPoolShare()}%`}
                  </div>
                  <span className={classes.feeSelectHeadingSpan}>
                    Share of pool
                  </span>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div style={{ marginBottom: 10, width: "95%" }}>
            <span className={classes.hintStyle}>
              By adding liquidity you'll earn 0.2% of all trades on this pair
              proportional to your share of the pool.
            </span>
          </div>

          <Button
            variant="contained"
            disabled={disableStatus()}
            onClick={handleAction}
            className={classes.addLiquidityButton}
          >
            {!addStatus.disabled && loading ? (
              <CircularProgress
                style={{ color: "black" }}
                color="secondary"
                size={30}
              />
            ) : (
              currentButton()
            )}
          </Button>
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
  addLiquidityEth,
  checkAllowance,
  confirmAllowance,
  getPoolShare,
  getLpBalance,
  loadPairContractAbi,
  getAccountBalance,
})(AddCard);
