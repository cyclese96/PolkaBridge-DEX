import { CircularProgress, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import TuneIcon from "@material-ui/icons/Tune";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useEffect, useState } from "react";
import SwapSettings from "../../common/SwapSettings";
import etherImg from "../../../assets/ether.png";
import bnbImg from "../../../assets/binance.png";
import CustomButton from "../../Buttons/CustomButton";
import SwapCardItem from "../../Cards/SwapCardItem";
import AddIcon from "@material-ui/icons/Add";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { ETH, etheriumNetwork, tokens } from "../../../constants";
import {
  fetchTokenAbi,
  formatCurrency,
  fromWei,
  getPercentage,
  getPercentAmountWithFloor,
  getPriceRatio,
  token1PerToken2,
  token2PerToken1,
  toWei,
} from "../../../utils/helper";
import pbrIcon from "../../../assets/balance.png";
import {
  checkLpAllowance,
  confirmLPAllowance,
  getLpBalance,
  removeLiquidityEth,
  loadPairContractAbi,
} from "../../../actions/dexActions";
import pwarImg from "../../../assets/pwar.png";
import SelectToken from "../../common/SelectToken";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import tokenThumbnail from "../../../utils/tokenThumbnail";
import BigNumber from "bignumber.js";
import {
  getPairAbi,
  getPairAddress,
  getTokenAbi,
} from "../../../utils/connectionUtils";
import { RESET_POOL_DATA, SET_TOKEN_ABI } from "../../../actions/types";
import store from "../../../store";
import { fetchContractAbi } from "../../../utils/httpUtils";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
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
    padding: 15,
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
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 2,
  },
  cardSubHeading: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 2,
  },
  settingIcon: {
    color: "#f6f6f6",
    cursor: "pointer",
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
      width: 100,
      padding: 2,
      marginLeft: 2,
      marginRight: 2,
    },
  },
  feeSelectHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  priceRangeCardContainer: {
    display: "flex",
    width: "90%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
  },
  feeSelectHeadingP: {
    fontSize: 14,
  },
  feeSelectHeadingSpan: {
    fontSize: 12,
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
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    width: "90%",
    border: "0.1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 7,
    // padding: 15,
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 5,
    height: 50,
    borderColor: "transparent",
    fontSize: 50,
    color: "white",
    maxWidth: 150,
    marginTop: 5,
    marginBlock: 15,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 100,
    },
  },
  percentageBtnGrp: {
    display: "flex",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  percentInputBtn: {
    color: "#E0077D",
    cursor: "pointer",
    border: "0.1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 7,
    marginLeft: 2,
    marginRight: 5,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  pairDetail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    width: "90%",
    border: "0.1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
  },
  tokenIcon: {
    width: "auto",
    height: 20,
    marginRight: 2,
  },
  priceContainer: {
    width: "90%",
    padding: 15,
  },
  spinner: {
    color: "#E0077D",
  },
}));

const RemoveCard = ({
  account: { balance, loading, currentNetwork, currentAccount },
  dex: {
    lpApproved,
    lpBalance,
    dexLoading,
    poolReserves,
    poolShare,
    swapSettings,
    pairContractData,
    tokenData,
  },
  handleBack,
  checkLpAllowance,
  confirmLPAllowance,
  getLpBalance,
  removeLiquidityEth,
  loadPairContractAbi,
}) => {
  const currentDefaultToken = {
    icon: etherImg,
    name: "Ethereum",
    symbol: "ETH",
  };
  const classes = useStyles();
  const [liquidityPercent, setLiquidityPercent] = useState(0);
  const [liquidityInputTemp, setLiquidityInputTemp] = useState("");
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState(currentDefaultToken);
  const [selectedToken2, setToken2] = useState({});

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

  useEffect(() => {
    if (currentNetwork === etheriumNetwork) {
      setToken1(tokens[0]);
      setToken2(tokens[2]);
    } else {
      setToken1({
        icon: bnbImg,
        name: "Binance",
        symbol: "BNB",
      });
      setToken2({
        icon: pwarImg,
        name: "Polkawar",
        symbol: "PWAR",
      });
    }
  }, [currentNetwork]);

  const currentLpApproved = () => {
    if (
      Object.keys(lpApproved).includes(
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      )
    ) {
      return lpApproved[`${selectedToken1.symbol}_${selectedToken2.symbol}`];
    } else {
      return lpApproved[`${selectedToken2.symbol}_${selectedToken1.symbol}`];
    }
  };

  const handleConfirmAllowance = async () => {
    const allowanceAmount = toWei("999999999");
    const pairData = { abi: currentPairAbi(), address: currentPairAddress() };
    await confirmLPAllowance(
      allowanceAmount,
      selectedToken1,
      selectedToken2,
      pairData,
      currentAccount,
      currentNetwork
    );
  };

  const currentLpBalance = () => {
    if (
      Object.keys(lpBalance).includes(
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      )
    ) {
      return lpBalance[`${selectedToken1.symbol}_${selectedToken2.symbol}`];
    } else {
      return lpBalance[`${selectedToken2.symbol}_${selectedToken1.symbol}`];
    }
  };

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

  // new use effect
  useEffect(async () => {
    if (selectedToken1.symbol && selectedToken2.symbol) {
      // reset input on token change
      handleClearState();
      store.dispatch({
        type: RESET_POOL_DATA,
      });

      // load erc20 token abi and balance
      const erc20Token =
        selectedToken1.symbol === ETH ? selectedToken2 : selectedToken1;
      let erc20Abi = erc20Token.imported
        ? tokenData[erc20Token.symbol].abi
        : getTokenAbi(erc20Token.symbol);

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
      // await getAccountBalance(
      //   {
      //     ...erc20Token,
      //     abi: erc20Abi,
      //   },
      //   currentNetwork
      // );
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

      await getLpBalance(
        selectedToken1,
        selectedToken2,
        _pairData,
        currentAccount,
        currentNetwork
      );

      if (!currentLpApproved()) {
        // console.log("checking approval");
        await checkLpAllowance(
          selectedToken1,
          selectedToken2,
          _pairData,
          currentAccount,
          currentNetwork
        );
      }
    }
  }, [selectedToken1, selectedToken2, currentNetwork, currentAccount]);

  // old use effect
  // useEffect(async () => {
  //   if (!currentLpApproved()) {
  //     // console.log("checking approval");
  //     await checkLpAllowance(
  //       selectedToken1,
  //       selectedToken2,
  //       currentAccount,
  //       currentNetwork
  //     );
  //   }

  //   await getLpBalance(
  //     selectedToken1,
  //     selectedToken2,
  //     currentAccount,
  //     currentNetwork
  //   );
  // }, [selectedToken1, selectedToken2, currentNetwork, currentAccount]);

  // const verifySwapStatus = (token1, token2) => {
  //   if (token1.selected.symbol === token2.selected.symbol) {
  //     setStatus({ message: "Invalid pair", disabled: true });
  //   } else if (
  //     (!token1.value && token1.selected.symbol) ||
  //     (!token2.value && token2.selected.symbol)
  //   ) {
  //     setStatus({ message: "Enter amounts", disabled: true });
  //   } else if (!token1.selected.symbol || !token2.selected.symbol) {
  //     setStatus({ message: "Select both tokens", disabled: true });
  //   } else if (
  //     token1.value > 0 &&
  //     token2.value > 0 &&
  //     token1.selected.symbol &&
  //     token2.selected.symbol
  //   ) {
  //     setStatus({ message: "Add liquidity", disabled: false });
  //   }
  // };

  // const onToken1InputChange = (tokens) => {
  //   setToken1Value(tokens);

  //   //calculate resetpective value of token 2 if selected
  //   let _token2Value;
  //   if (selectedToken2.symbol && tokens) {
  //     const t = token2PerToken1(from_token.price, to_token.price);
  //     _token2Value = parseFloat(tokens) * t;
  //     setToken2Value(_token2Value);
  //   } else if (selectedToken2.symbol && !tokens) {
  //     setToken2Value("");
  //   }

  //   verifySwapStatus(
  //     { value: tokens, selected: selectedToken1 },
  //     { value: _token2Value, selected: selectedToken2 }
  //   );
  // };

  // const onToken2InputChange = (tokens) => {
  //   setToken2Value(tokens);

  //   //calculate respective value of token1 if selected
  //   let _token1Value;
  //   if (selectedToken1.symbol && tokens) {
  //     const t = token1PerToken2(from_token.price, to_token.price);
  //     _token1Value = parseFloat(tokens) * t;
  //     setToken1Value(_token1Value);
  //   } else if (selectedToken1.symbol && !tokens) {
  //     setToken1Value("");
  //   }

  //   verifySwapStatus(
  //     { value: _token1Value, selected: selectedToken1 },
  //     { value: tokens, selected: selectedToken2 }
  //   );
  // };

  const onToken1Select = (token) => {
    setToken1(token);

    // verifySwapStatus(
    //   { value: token1Value, selected: token },
    //   { value: token2Value, selected: selectedToken2 }
    // );
  };
  const onToken2Select = (token) => {
    setToken2(token);
    // verifySwapStatus(
    //   { value: token1Value, selected: selectedToken1 },
    //   { value: token2Value, selected: token }
    // );
  };

  const handleClearState = () => {
    handleInputChange("");
  };

  const handleRemoveLiquidity = async () => {
    const ethToken =
      selectedToken1.symbol === ETH ? selectedToken1 : selectedToken2;
    const erc20Token =
      selectedToken1.symbol === ETH ? selectedToken2 : selectedToken1;
    const lpAmount = getPercentAmountWithFloor(
      currentLpBalance(),
      liquidityPercent
    );
    console.log({ ethToken, erc20Token, lpAmount });
    await removeLiquidityEth(
      ethToken,
      erc20Token,
      currentAccount,
      lpAmount,
      swapSettings.deadline,
      currentNetwork
    );

    const pairData = { address: currentPairAddress(), abi: currentPairAbi() };
    await getLpBalance(
      selectedToken1,
      selectedToken2,
      pairData,
      currentAccount,
      currentNetwork
    );

    handleClearState();
  };

  const handleInputChange = (value) => {
    if (!value) {
      setLiquidityPercent("0");
    } else {
      setLiquidityPercent(value);
    }
    setLiquidityInputTemp(value);
  };

  return (
    <>
      <SwapSettings open={settingOpen} handleClose={close} />
      <div className={classes.card}>
        <div className="card-theme">
          <div className={classes.cardContents}>
            <div className={classes.cardHeading}>
              <KeyboardBackspaceIcon
                fontSize="default"
                onClick={handleBack}
                className={classes.settingIcon}
              />
              <p>Remove Liquidity</p>
              <TuneIcon
                fontSize="default"
                onClick={handleSettings}
                className={classes.settingIcon}
              />
            </div>

            <div className={classes.inputWrapper}>
              <div className={classes.cardHeading}>
                <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Amount
                </span>
                <span
                  className={classes.clearButton}
                  onClick={handleClearState}
                >
                  Clear
                </span>
              </div>

              <div>
                <input
                  type="text"
                  className={classes.input}
                  onChange={({ target: { value } }) => handleInputChange(value)}
                  value={liquidityInputTemp}
                  placeholder="0.0"
                />
                <span style={{ fontSize: 50 }}>%</span>
              </div>

              <div className={classes.percentageBtnGrp}>
                <span
                  className={classes.percentInputBtn}
                  onClick={() => handleInputChange("25")}
                >
                  25%
                </span>
                <span
                  className={classes.percentInputBtn}
                  onClick={() => handleInputChange("50")}
                >
                  50%
                </span>
                <span
                  className={classes.percentInputBtn}
                  onClick={() => handleInputChange("75")}
                >
                  75%
                </span>
                <span
                  className={classes.percentInputBtn}
                  onClick={() => handleInputChange("100")}
                >
                  Max
                </span>
              </div>
            </div>

            <div className="mt-2 mb-2">
              <ArrowDownwardIcon />
            </div>

            <div className={classes.pairDetail}>
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <SelectToken
                    selectedToken={selectedToken1}
                    disableToken={selectedToken2}
                    handleTokenSelected={onToken1Select}
                  />
                </div>
                <div className="d-flex">
                  <SelectToken
                    selectedToken={selectedToken2}
                    disableToken={selectedToken1}
                    handleTokenSelected={onToken2Select}
                  />
                </div>
              </div>
              {/* <div className="d-flex justify-content-between mt-2">
                <div>
                  <h5></h5>
                </div>
                <div className="d-flex">
                   <img
                    className={classes.tokenIcon}
                    src={selectedToken2 ? selectedToken2.icon : ""}
                    alt={""}
                  />
                  <SelectToken
                    selectedToken={selectedToken2}
                    disableToken={selectedToken1}
                    handleTokenSelected={onToken2Select}
                  />
                  <h5>{selectedToken2.symbol}</h5>
                </div>
              </div>  */}
              <div className="d-flex justify-content-end mb-1">
                {/* <span className={classes.clearButton}>Receive WETH</span> */}
              </div>
            </div>

            <div className={classes.priceContainer}>
              {dexLoading ? (
                <div className="d-flex justify-content-center">
                  <CircularProgress className={classes.spinner} size={30} />
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between">
                    <span>Price:</span>
                    <span>
                      1 {selectedToken1.symbol} ={" "}
                      {getPriceRatio(
                        poolReserves[selectedToken2.symbol],
                        poolReserves[selectedToken1.symbol]
                      )}{" "}
                      {selectedToken2.symbol}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span></span>
                    <span>
                      {" "}
                      1 {selectedToken2.symbol} ={" "}
                      {getPriceRatio(
                        poolReserves[selectedToken1.symbol],
                        poolReserves[selectedToken2.symbol]
                      )}{" "}
                      {selectedToken1.symbol}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex mt-4">
              <CustomButton
                variant="light"
                className={classes.approveBtn}
                disabled={dexLoading || currentLpApproved()}
                onClick={handleConfirmAllowance}
              >
                {currentLpApproved() ? (
                  <>
                    Approved{" "}
                    <CheckCircleIcon
                      style={{ color: "#E0077D", marginLeft: 5 }}
                      fontSize="small"
                    />{" "}
                  </>
                ) : dexLoading ? (
                  <CircularProgress className={classes.spinner} size={30} />
                ) : (
                  "Approve"
                )}
              </CustomButton>
              <CustomButton
                variant="primary"
                className={classes.removeBtn}
                disabled={
                  dexLoading ||
                  !currentLpApproved() ||
                  new BigNumber(currentLpBalance()).eq(0) ||
                  new BigNumber(liquidityPercent).eq(0)
                }
                onClick={handleRemoveLiquidity}
              >
                Remove
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className={classes.card}>
          <div className="card-theme2">
            <div className={classes.priceContainer}>
              {dexLoading ? (
                <div className="d-flex justify-content-center pt-2 pb-2">
                  <CircularProgress className={classes.spinner} size={30} />
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between">
                    <span>Your Position</span>
                    <span></span>
                  </div>
                  <div className="d-flex justify-content-between mt-2 mb-2">
                    <div>
                      <img
                        className={classes.tokenIcon}
                        src={tokenThumbnail(selectedToken1.symbol)}
                        alt={""}
                      />
                      <img
                        className={classes.tokenIcon}
                        src={tokenThumbnail(selectedToken2.symbol)}
                        alt={""}
                      />
                      <span>
                        {selectedToken1.symbol}/{selectedToken2.symbol}{" "}
                        {`( LP tokens )`}
                      </span>
                    </div>
                    <span>{formatCurrency(fromWei(currentLpBalance()))}</span>
                  </div>
                  <div className="d-flex justify-content-between mt-1 mb-1">
                    <span>Your pool share:</span>
                    <span>{poolShare} %</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {
  checkLpAllowance,
  confirmLPAllowance,
  getLpBalance,
  removeLiquidityEth,
  loadPairContractAbi,
})(RemoveCard);
