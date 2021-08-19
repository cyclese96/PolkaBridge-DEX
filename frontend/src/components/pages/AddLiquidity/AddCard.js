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
import { ETH, etheriumNetwork } from "../../../constants";
import {
  formatCurrency,
  token1PerToken2,
  token2PerToken1,
  toWei,
} from "../../../utils/helper";
import {
  addLiquidityEth,
  checkAllowance,
  confirmAllowance,
  getPoolShare,
} from "../../../actions/dexActions";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import tokenThumbnail from "../../../utils/tokenThumbnail";
import BigNumber from "bignumber.js";
import store from "../../../store";
import { RESET_POOL_SHARE } from "../../../actions/types";

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
  hintStyle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 20,
  },
}));

const AddCard = (props) => {
  const {
    account: { balance, loading, currentNetwork, currentAccount },
    dex: { swapSettings, approvedTokens, poolShare },
    addLiquidityEth,
    checkAllowance,
    confirmAllowance,
    getPoolShare,
    handleBack,
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
  const [token1Value, setToken1Value] = useState("0"); // token1 for eth only
  const [token2Value, setToken2Value] = useState("0"); // token2 for pbr

  // const [token1PerToken2, setPerToken1] = useState("1.4545");
  // const [token2PerToken1, setPerToken2] = useState("0.66891");
  // const [shareOfPool, setShare] = useState("0.04"); // to be calculated

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
    let defaultToken1, defaultToken2;
    if (currentNetwork === etheriumNetwork) {
      defaultToken1 = {
        icon: tokenThumbnail("PBR"),
        name: "Polkabridge",
        symbol: "PBR",
      };
      defaultToken2 = {
        icon: etherImg,
        name: "Ethereum",
        symbol: "ETH",
      };
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

  useEffect(async () => {
    if (
      !selectedToken1.symbol ||
      selectedToken1.symbol === ETH ||
      approvedTokens[selectedToken1.symbol]
    ) {
      //skip approve check for eth
      return;
    }
    console.log("checking approval");
    await checkAllowance(selectedToken1, currentAccount, currentNetwork);
  }, [selectedToken1, currentNetwork, currentAccount]);

  const handleConfirmAllowance = async () => {
    const allowanceAmount = toWei("9999999999");
    await confirmAllowance(
      allowanceAmount,
      selectedToken1,
      currentAccount,
      currentNetwork
    );
  };

  const verifySwapStatus = (token1, token2) => {
    console.log({ token1, token2 });
    let message, disabled;
    const _token1 = new BigNumber(token1.value);
    const _token2 = new BigNumber(token2.value);

    if (token1.selected.symbol === token2.selected.symbol) {
      // setStatus({ message: "Invalid pair", disabled: true });
      message = "Invalid pair";
      disabled = true;
    } else if (
      (_token1.eq("0") && token1.selected.symbol) ||
      (_token2.eq("0") && token2.selected.symbol)
    ) {
      // setStatus({ message: "Enter amounts", disabled: true });
      message = "Enter amounts";
      disabled = true;
    } else if (!token1.selected.symbol || !token2.selected.symbol) {
      // setStatus({ message: "Select both tokens", disabled: true });
      message = "Select both tokens";
      disabled = true;
    } else if (
      _token1.gt("0") &&
      _token2.gt("0") &&
      token1.selected.symbol &&
      token2.selected.symbol
    ) {
      console.log("passed");

      // setStatus({ message: "", disabled: false });
      message = "";
      disabled = false;
    }

    setStatus({ message, disabled });

    if (!disabled) {
      console.log("input  ", token1.value);
      getPoolShare(
        selectedToken1.symbol,
        selectedToken2.symbol,
        token1.value,
        token2.value,
        currentNetwork
      );
    }
  };

  const onToken1InputChange = (tokens) => {
    setToken1Value(tokens);

    //calculate resetpective value of token 2 if selected
    let _token2Value = "";
    // if (selectedToken2.symbol && tokens) {
    //   const t = token2PerToken1(from_token.price, to_token.price);
    //   _token2Value = parseFloat(tokens) * t;
    //   setToken2Value(_token2Value);
    // } else if (selectedToken2.symbol && !tokens) {
    //   setToken2Value("");
    // }

    verifySwapStatus(
      { value: tokens, selected: selectedToken1 },
      { value: token2Value, selected: selectedToken2 }
    );
  };

  const onToken2InputChange = (tokens) => {
    setToken2Value(tokens);

    //calculate respective value of token1 if selected
    let _token1Value = "";
    // if (selectedToken1.symbol && tokens) {
    //   const t = token1PerToken2(from_token.price, to_token.price);
    //   _token1Value = parseFloat(tokens) * t;
    //   setToken1Value(_token1Value);
    // } else if (selectedToken1.symbol && !tokens) {
    //   setToken1Value("");
    // }

    verifySwapStatus(
      { value: token1Value, selected: selectedToken1 },
      { value: tokens, selected: selectedToken2 }
    );
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
      { value: token1Value, selected: token },
      { value: token2Value, selected: selectedToken2 }
    );
  };
  const onToken2Select = (token) => {
    setToken2(token);
    resetInput();

    verifySwapStatus(
      { value: token1Value, selected: selectedToken1 },
      { value: token2Value, selected: token }
    );
  };

  const handleClearState = () => {
    setToken1Value("");
    setToken2Value("");
    // setToken1(currentDefaultToken);
    // setToken2({});

    verifySwapStatus(
      { value: "", selected: selectedToken1 },
      { value: "", selected: selectedToken2 }
    );
  };

  const handleAddLiquidity = async () => {
    let etherToken, erc20Token;
    if (selectedToken1.symbol === ETH) {
      etherToken = {
        amount: token1Value.toString(),
        min: token1Value,
        symbol: selectedToken1.symbol,
      };
      erc20Token = {
        amount: toWei(token2Value.toString()),
        min: toWei(token2Value.toString()),
        symbol: selectedToken2.symbol,
      };
    } else {
      etherToken = {
        amount: token2Value.toString(),
        min: token2Value,
        symbol: "ETH",
      };
      erc20Token = {
        amount: toWei(token1Value.toString()),
        min: toWei(token1Value.toString()),
        symbol: selectedToken1.symbol,
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

  const getPriceRatio = (token1, token2) => {
    const _token1 = new BigNumber(token1);
    const _token2 = new BigNumber(token2);
    if (_token1.eq("0") || _token2.eq("0")) {
      return new BigNumber("0").toFixed(4).toString();
    }
    const _ratio = _token1.div(_token2).toFixed(4).toString();
    return _ratio;
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
              <p>Add Liquidity</p>
              <TuneIcon
                fontSize="default"
                onClick={handleSettings}
                className={classes.settingIcon}
              />
            </div>

            <div className={classes.cardHeading}>
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Select pair
              </span>
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
            <AddIcon fontSize="default" className={classes.settingIcon} />
            <SwapCardItem
              onInputChange={onToken2InputChange}
              onTokenChange={onToken2Select}
              currentToken={selectedToken2}
              disableToken={selectedToken1}
              inputValue={token2Value}
            />

            {selectedToken1.symbol && selectedToken2.symbol ? (
              <>
                <div className={classes.cardSubHeading}>
                  <span className={classes.hintStyle}>
                    Prices and Pool share
                  </span>
                </div>

                <div className={classes.selectPoolContainer}>
                  <div className={classes.feeSelectContainer}>
                    <div className={classes.feeSelectHeading}>
                      <p className={classes.feeSelectHeadingP}>
                        {/* {formatCurrency(
                          parseFloat(token1Value) / parseFloat(token2Value),
                          false,
                          2,
                          false
                        )} */}
                        {getPriceRatio(token1Value, token2Value)}
                      </p>
                    </div>
                    <span className={classes.feeSelectHeadingSpan}>
                      {`${selectedToken1.symbol} per ${selectedToken2.symbol}`}
                    </span>
                  </div>

                  <div className={classes.feeSelectContainer}>
                    <div className={classes.feeSelectHeading}>
                      <p className={classes.feeSelectHeadingP}>
                        {/* {formatCurrency(
                          parseFloat(token2Value) / parseFloat(token1Value)
                        )} */}
                        {getPriceRatio(token2Value, token1Value)}
                      </p>
                    </div>
                    <span className={classes.feeSelectHeadingSpan}>
                      {`${selectedToken2.symbol} per ${selectedToken1.symbol}`}
                    </span>
                  </div>

                  <div className={classes.feeSelectContainer}>
                    <div className={classes.feeSelectHeading}>
                      <p
                        className={classes.feeSelectHeadingP}
                      >{`${poolShare}%`}</p>
                    </div>
                    <span className={classes.feeSelectHeadingSpan}>
                      Share of pool
                    </span>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            <div style={{ marginBottom: 10 }}>
              <span className={classes.hintStyle}>
                By adding liquidity you'll earn 0.2% of all trades on this pair
                proportional to your share of the pool.
              </span>
            </div>

            <div className="d-flex justify-content-center mt-2 mb-1">
              <span>{addStatus.message}</span>
            </div>
            <div className="d-flex  mt-4">
              <CustomButton
                variant="light"
                className={classes.approveBtn}
                disabled={approvedTokens[selectedToken1.symbol]}
                onClick={handleConfirmAllowance}
              >
                {approvedTokens[selectedToken1.symbol] ? (
                  <>
                    Approved{" "}
                    <CheckCircleIcon
                      style={{ color: "#E0077D", marginLeft: 5 }}
                      fontSize="small"
                    />{" "}
                  </>
                ) : loading ? (
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
                disabled={addStatus.disabled | loading}
                onClick={handleAddLiquidity}
              >
                {!addStatus.disabled && loading ? (
                  <CircularProgress
                    style={{ color: "black" }}
                    color="secondary"
                    size={30}
                  />
                ) : (
                  "Add liquidity"
                )}
              </CustomButton>
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
  addLiquidityEth,
  checkAllowance,
  confirmAllowance,
  getPoolShare,
})(AddCard);
