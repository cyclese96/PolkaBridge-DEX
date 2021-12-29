import {
  Card,
  CircularProgress,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useEffect, useState } from "react";
import SwapSettings from "../../common/SwapSettings";
import etherImg from "../../../assets/ether.png";
import bnbImg from "../../../assets/binance.png";
import CustomButton from "../../Buttons/CustomButton";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { allowanceAmount, ETH, etheriumNetwork, tokens } from "../../../constants";
import {
  fromWei,
  getPercentAmountWithFloor,
  getPriceRatio,
} from "../../../utils/helper";
import {
  checkLpAllowance,
  confirmLPAllowance,
  getLpBalance,
  removeLiquidityEth,
  loadPairAddress,
  removeLiquidity,
} from "../../../actions/dexActions";
import { getAccountBalance } from '../../../actions/accountActions'
import pwarImg from "../../../assets/pwar.png";
import SelectToken from "../../common/SelectToken";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import tokenThumbnail from "../../../utils/tokenThumbnail";
import BigNumber from "bignumber.js";
import { getPairAddress } from "../../../utils/connectionUtils";
import { RESET_POOL_DATA, START_TRANSACTION } from "../../../actions/types";
import store from "../../../store";
import { Settings } from "@material-ui/icons";
import { formatCurrency } from "../../../utils/formatters";
import TransactionConfirm from "../../common/TransactionConfirm";

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
  cardHeading: {
    paddingTop: 5,
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 2,
  },
  cardFeature: {
    paddingLeft: 10,
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingIcon: {
    color: "#f6f6f6",
    fontSize: 22,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      fontSize: 17,
    },
  },
  selectToken: {
    width: 150,
  },
  clearButton: {
    color: "#E0077D",
    cursor: "pointer",
    fontSize: 16,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  inputWrapper: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    width: "95%",

    border: "1px solid #414141",
    borderRadius: 15,
    padding: 7,
  },
  input: {
    backgroundColor: "transparent",
    maxWidth: 240,
    height: 50,
    textAlign: "right",
    borderColor: "transparent",
    fontSize: 50,
    color: "white",
    outline: "none",
    marginTop: 5,
    marginBlock: 15,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 170,
      height: 45,
      fontSize: 30,
    },
  },
  percentageSymbol: {
    fontSize: 20,
    paddingTop: 20,
    color: "#fce4ec",
    [theme.breakpoints.down("sm")]: {
      fontSize: 17,
      paddingTop: 10,
    },
  },
  percentageBtnGrp: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  percentInputBtn: {
    color: "#E0077D",
    cursor: "pointer",
    border: "0.1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: "5px 15px 5px 15px",
    marginLeft: 5,
    marginRight: 5,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  pairDetail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    width: "95%",
    border: "0.1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
  },
  tokenIcon: {
    width: "auto",
    height: 20,
    marginRight: 2,
    borderRadius: "50%",
  },
  priceContainer: {
    width: "95%",
    padding: 15,
    color: "#bdbdbd",
    fontSize: 13,
  },
  spinner: {
    color: "#E0077D",
  },
}));

const RemoveCard = ({
  account: { currentNetwork, currentAccount, connected },
  dex: {
    lpApproved,
    lpBalance,
    dexLoading,
    poolReserves,
    poolShare,
    swapSettings,
    pairContractData,
    transaction,
  },
  handleBack,
  checkLpAllowance,
  confirmLPAllowance,
  getLpBalance,
  removeLiquidityEth,
  loadPairAddress,
  removeLiquidity,
  getAccountBalance
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
  const [selectedToken0, setToken1] = useState(currentDefaultToken);
  const [selectedToken1, setToken2] = useState({});

  const [swapDialogOpen, setSwapDialog] = useState(false);

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
        `${selectedToken0.symbol}_${selectedToken1.symbol}`
      )
    ) {
      return lpApproved[`${selectedToken0.symbol}_${selectedToken1.symbol}`];
    } else {
      return lpApproved[`${selectedToken1.symbol}_${selectedToken0.symbol}`];
    }
  };

  const handleConfirmAllowance = async () => {
    const _allowanceAmount = allowanceAmount;
    const pairAddress = currentPairAddress();
    await confirmLPAllowance(
      _allowanceAmount,
      selectedToken0,
      selectedToken1,
      pairAddress,
      currentAccount,
      currentNetwork
    );
  };

  const currentLpBalance = () => {
    if (
      Object.keys(lpBalance).includes(
        `${selectedToken0.symbol}_${selectedToken1.symbol}`
      )
    ) {
      return lpBalance[`${selectedToken0.symbol}_${selectedToken1.symbol}`];
    } else if (
      Object.keys(lpBalance).includes(
        `${selectedToken1.symbol}_${selectedToken0.symbol}`
      )
    ) {
      return lpBalance[`${selectedToken1.symbol}_${selectedToken0.symbol}`];
    } else {
      return "0";
    }
  };

  const currentPairAddress = () => {
    if (
      Object.keys(pairContractData).includes(
        `${selectedToken0.symbol}_${selectedToken1.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken0.symbol}_${selectedToken1.symbol}`
      ];
    } else if (
      Object.keys(pairContractData).includes(
        `${selectedToken1.symbol}_${selectedToken0.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken1.symbol}_${selectedToken0.symbol}`
      ];
    } else {
      return null;
    }
  };

  // new use effect
  useEffect(() => {
    async function loadPair() {
      if (selectedToken0.symbol && selectedToken1.symbol) {
        // reset input on token change
        handleClearState();
        store.dispatch({
          type: RESET_POOL_DATA,
        });

        // load erc20 token abi and balance
        const erc20Token =
          selectedToken0.symbol === ETH ? selectedToken1 : selectedToken0;

        let _pairAddress = currentPairAddress();
        if (!_pairAddress) {
          _pairAddress = await getPairAddress(
            selectedToken0.address,
            selectedToken1.address,
            currentNetwork
          );
          loadPairAddress(
            selectedToken0.symbol,
            selectedToken1.symbol,
            _pairAddress,
            currentNetwork
          );
        }

        await getLpBalance(
          selectedToken0,
          selectedToken1,
          _pairAddress,
          currentAccount,
          currentNetwork
        );

        await checkLpAllowance(
          selectedToken0,
          selectedToken1,
          _pairAddress,
          currentAccount,
          currentNetwork
        );
      }
    }

    loadPair();
  }, [selectedToken0, selectedToken1, currentNetwork, currentAccount]);

  const onToken1Select = (token) => {
    setToken1(token);
  };
  const onToken2Select = (token) => {
    setToken2(token);
  };

  const handleClearState = () => {
    handleInputChange("");
  };

  const handleRemoveLiquidity = async () => {

    const lpAmount = getPercentAmountWithFloor(
      currentLpBalance(),
      liquidityPercent
    );

    const _lpAmount = lpAmount;

    if (selectedToken0.symbol === ETH || selectedToken1.symbol === ETH) {
      // remove liquidity eth-erc20 || erc20 - eth
      let ethToken, erc20Token;
      if (selectedToken0.symbol === ETH) {
        ethToken = selectedToken0;
        erc20Token = selectedToken1;
      } else {
        ethToken = selectedToken1;
        erc20Token = selectedToken0;
      }

      await removeLiquidityEth(
        ethToken,
        erc20Token,
        currentAccount,
        _lpAmount,
        swapSettings.deadline,
        currentNetwork
      );
    } else {
      // remove liquidy erc20 - erc20

      await removeLiquidity(
        selectedToken0,
        selectedToken1,
        currentAccount,
        _lpAmount,
        swapSettings.deadline,
        currentNetwork
      );
    }

    const pairAddress = currentPairAddress();
    await getLpBalance(
      selectedToken0,
      selectedToken1,
      pairAddress,
      currentAccount,
      currentNetwork
    );
  };

  const handleInputChange = (value) => {
    if (!value) {
      setLiquidityPercent("0");
    } else {
      setLiquidityPercent(value);
    }
    setLiquidityInputTemp(value);
  };

  const priceRatio1 = () => {
    return getPriceRatio(
      fromWei(poolReserves[selectedToken1.symbol], selectedToken1.decimals),
      fromWei(poolReserves[selectedToken0.symbol], selectedToken0.decimals)
    );
  };

  const priceRatio2 = () => {
    return getPriceRatio(
      fromWei(poolReserves[selectedToken0.symbol], selectedToken0.decimals),
      fromWei(poolReserves[selectedToken1.symbol], selectedToken1.decimals)
    );
  };

  // liquidity transaction status updates
  useEffect(() => {
    if (!transaction.hash && !transaction.type) {
      return;
    }

    if (transaction.type === "remove" && transaction.status === "success") {
      getAccountBalance(selectedToken0, currentNetwork)
      getAccountBalance(selectedToken1, currentNetwork)
    }

    if (
      transaction.type === "remove" &&
      (transaction.status === "success" || transaction.status === "failed")
    ) {
      setSwapDialog(true);
    }
  }, [transaction]);

  const handleConfirmSwapClose = (value) => {
    setSwapDialog(value);
    if (transaction.type === "remove" && transaction.status === "success") {
      store.dispatch({ type: START_TRANSACTION });
      handleClearState();
    } else if (
      transaction.type === "remove" &&
      transaction.status === "failed"
    ) {
      store.dispatch({ type: START_TRANSACTION });
    }
  };

  const currentPairDecimals = (token1, token2) => {
    return (parseInt(token1.decimals) + parseInt(token2.decimals)) / 2;
  }

  return (
    <>
      <SwapSettings open={settingOpen} handleClose={close} />
      <TransactionConfirm
        open={swapDialogOpen}
        handleClose={() => handleConfirmSwapClose(false)}
        selectedToken0={selectedToken0}
        selectedToken1={selectedToken1}
        token1Value={0}
        token2Value={0}
        priceImpact={0}
      />
      <Card elevation={20} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.cardHeading}>
            <IconButton onClick={handleBack} style={{ margin: 0, padding: 0 }}>
              <KeyboardBackspaceIcon
                fontSize="default"
                className={classes.settingIcon}
              />
            </IconButton>
            <h6 style={{ paddingTop: 5 }}>Remove Liquidity</h6>
            <IconButton
              onClick={handleSettings}
              style={{ margin: 0, padding: 0 }}
            >
              <Settings fontSize="default" className={classes.settingIcon} />
            </IconButton>
          </div>

          <div className={classes.inputWrapper}>
            <div className={classes.cardFeature}>
              <span style={{ color: "#bdbdbd" }}>Amount</span>
              <span className={classes.clearButton} onClick={handleClearState}>
                Clear
              </span>
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <div>
                <input
                  type="text"
                  className={classes.input}
                  onChange={({ target: { value } }) => handleInputChange(value)}
                  value={liquidityInputTemp}
                  placeholder="0.0"
                />
              </div>
              <div className={classes.percentageSymbol}>%</div>
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
            <ArrowDownwardIcon style={{ color: "#bdbdbd" }} />
          </div>

          <div className={classes.pairDetail}>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <SelectToken
                  selectedToken={selectedToken0}
                  disableToken={selectedToken1}
                  handleTokenSelected={onToken1Select}
                />
              </div>
              <div className="d-flex">
                <SelectToken
                  selectedToken={selectedToken1}
                  disableToken={selectedToken0}
                  handleTokenSelected={onToken2Select}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mb-1">
              {/* <span className={classes.clearButton}>Receive WETH</span> */}
            </div>
          </div>

          <div className={classes.priceContainer}>
            {dexLoading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className={classes.spinner} size={30} />
              </div>
            ) : new BigNumber(priceRatio1()).eq(0) && !connected ? (
              <div className="d-flex justify-content-center">
                <span>{connected ? "No liquidity available for selected pool" : "Connect wallet first"}</span>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between">
                  <span>Price:</span>
                  <span>
                    1 {selectedToken0.symbol} = {priceRatio1()}
                    {selectedToken1.symbol}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span></span>
                  <span>
                    {" "}
                    1 {selectedToken1.symbol} = {priceRatio2()}
                    {selectedToken0.symbol}
                  </span>
                </div>
              </>
            )}
          </div>
          <div style={{ color: "#DF097C", fontSize: 13 }}>
            {dexLoading ||
              !currentLpApproved() ||
              new BigNumber(currentLpBalance()).eq(0) ||
              (new BigNumber(liquidityPercent).eq(0) &&
                "* Choose your amount of first to remove liquidity.")}
          </div>
          <div className="d-flex ">
            <CustomButton
              variant="light"
              className={classes.approveBtn}
              disabled={
                dexLoading ||
                currentLpApproved() ||
                new BigNumber(currentLpBalance()).eq(0)
              }
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
      </Card>

      <div className="mt-4 mb-5">
        <Card elevation={20} className={classes.card}>
          <div className={classes.priceContainer}>
            {false ? (
              <div className="d-flex justify-content-center pt-2 pb-2">
                <CircularProgress className={classes.spinner} size={30} />
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-center">
                  <div style={{ fontSize: 15, textAlign: "center" }}>
                    Your Position
                  </div>
                </div>

                <div className="d-flex justify-content-between my-2">
                  <div>
                    <img
                      className={classes.tokenIcon}
                      src={tokenThumbnail(selectedToken0.symbol)}
                      alt={""}
                    />
                    <img
                      className={classes.tokenIcon}
                      src={tokenThumbnail(selectedToken1.symbol)}
                      alt={""}
                    />
                    <span>
                      {selectedToken0.symbol}/{selectedToken1.symbol}{" "}
                      {`( LP tokens )`}
                    </span>
                  </div>
                  <span>{formatCurrency(fromWei(currentLpBalance(), currentPairDecimals(selectedToken0, selectedToken1)))}</span>
                </div>
                <div className="d-flex justify-content-between mt-3 mb-3">
                  <div>Your pool share:</div>
                  <div>{poolShare}%</div>
                </div>
              </>
            )}
          </div>
        </Card>
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
  loadPairAddress,
  removeLiquidity,
  getAccountBalance
})(RemoveCard);
