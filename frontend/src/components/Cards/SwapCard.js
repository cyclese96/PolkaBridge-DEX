import React, { useEffect } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import TuneIcon from "@material-ui/icons/Tune";
import SwapCardItem from "./SwapCardItem";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import { useState } from "react";
import SwapSettings from "../common/SwapSettings";
import etherImg from "../../assets/ether.png";
import bnbImg from "../../assets/binance.png";
import CustomButton from "../Buttons/CustomButton";
import BigNumber from "bignumber.js";
import CustomSnackBar from "../common/CustomSnackbar";
import { ETH, etheriumNetwork } from "../../constants";
import CachedIcon from "@material-ui/icons/Cached";
import {
  fromWei,
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
} from "../../actions/dexActions";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

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
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingIcon: {
    color: "#f6f6f6",
    cursor: "pointer",
    marginTop: 7,
    marginBottom: 7,
    transition: "all 0.4s ease",
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

const SwapCard = ({
  account: { balance, loading, currentNetwork, currentAccount },
  dex: { swapSettings, from_token, to_token, approvedTokens },
  swapEthForExactTokens,
  swapExactEthForTokens,
  checkAllowance,
  confirmAllowance,
  tokenType,
  getTokenPrice,
}) => {
  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState({
    icon: etherImg,
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
      _token = {
        icon: etherImg,
        name: "Ethereum",
        symbol: "ETH",
      };
      setToken1(_token);
    } else {
      _token = {
        icon: bnbImg,
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
    await checkAllowance(_token, currentAccount, currentNetwork);
    return () => {
      console.log("unmounted");
    };
  }, [currentNetwork, currentAccount]);

  useEffect(async () => {
    if (
      !selectedToken1.symbol ||
      selectedToken1.symbol === ETH ||
      approvedTokens[selectedToken1.symbol]
    ) {
      //skip approve check for eth
      return;
    }
    console.log("checking approval in swap");
    await checkAllowance(selectedToken1, currentAccount, currentNetwork);
  }, [selectedToken1, currentNetwork, currentAccount]);

  const verifySwapStatus = (token1, token2) => {
    if (token1.selected.symbol === token2.selected.symbol) {
      setStatus({ message: "Invalid pair", disabled: true });
    } else if (
      (!token1.value && token1.selected.symbol) ||
      (!token2.value && token2.selected.symbol)
    ) {
      setStatus({ message: "Enter amounts", disabled: true });
    } else if (!token1.selected.symbol || !token2.selected.symbol) {
      setStatus({ message: "Select both tokens", disabled: true });
    } else if (
      token1.value > 0 &&
      token2.value > 0 &&
      token1.selected.symbol &&
      token2.selected.symbol
    ) {
      setStatus({ message: "Swap Tokens", disabled: false });
    }
  };

  const onToken1InputChange = (tokens) => {
    setToken1Value(tokens);

    //calculate resetpective value of token 2 if selected
    let _token2Value = "";
    if (selectedToken2.symbol && tokens) {
      const t = token2PerToken1(from_token.price, to_token.price);
      _token2Value = parseFloat(tokens) * t;
      setToken2Value(_token2Value);
    } else if (selectedToken2.symbol && !tokens) {
      setToken2Value("");
    }

    // verify swap status with current inputs
    verifySwapStatus(
      { value: tokens, selected: selectedToken1 },
      { value: _token2Value, selected: selectedToken2 }
    );
  };

  const onToken2InputChange = (tokens) => {
    setToken2Value(tokens);

    //calculate respective value of token1 if selected
    let _token1Value = "";
    if (selectedToken1.symbol && tokens) {
      const t = token1PerToken2(from_token.price, to_token.price);
      _token1Value = parseFloat(tokens) * t;
      setToken1Value(_token1Value);
    } else if (selectedToken1.symbol && !tokens) {
      setToken1Value("");
    }

    // verify swap status with current inputs
    verifySwapStatus(
      { value: _token1Value, selected: selectedToken1 },
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
    setAlert({ status: true, message: "Transaction submitted " });

    const token1 = {
      amount: toWei(token1Value.toString()),
      min: toWei(token1Value.toString()),
      symbol: selectedToken1.symbol,
    };

    const token2 = {
      amount: toWei(token2Value.toString()),
      min: toWei(token2Value.toString()),
      symbol: selectedToken2.symbol,
    };

    console.log(swapSettings);
    console.log("final params", { token1, token2 });
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
      await swapEthForExactTokens(
        token1,
        token2,
        swapSettings.deadline,
        currentAccount,
        currentNetwork
      );
    }
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

  const handleTokenPriceRatio = () => {};

  return (
    <>
      <CustomSnackBar
        status={snackAlert.status}
        message={snackAlert.message}
        handleClose={hideSnackbar}
      />
      <SwapSettings open={settingOpen} handleClose={close} />
      <div className={classes.card}>
        <div className="card-theme">
          <div className={classes.cardContents}>
            <div className={classes.cardHeading}>
              <p>Swap tokens </p>
              <TuneIcon
                fontSize="default"
                onClick={handleSettings}
                className={classes.settingIcon}
              />
            </div>

            <SwapCardItem
              inputType="from"
              onInputChange={onToken1InputChange}
              onTokenChange={onToken1Select}
              currentToken={selectedToken1}
              inputValue={token1Value}
            />
            <SwapVertIcon
              fontSize="default"
              className={[
                classes.settingIcon,
                rotate ? classes.rotate1 : classes.rotate2,
              ].join(" ")}
              onClick={handleSwapInputs}
            />
            <SwapCardItem
              inputType="to"
              onInputChange={onToken2InputChange}
              onTokenChange={onToken2Select}
              currentToken={selectedToken2}
              inputValue={token2Value}
            />
            <div className={classes.priceRatio}>
              <small>Price</small>
              <small>41,250 PBR per ETH </small>
              <CachedIcon
                onClick={handleTokenPriceRatio}
                className={classes.resetIcon}
                fontSize="small"
              />
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
                disabled={swapStatus.disabled | loading}
                onClick={handleSwapToken}
              >
                {!swapStatus.disabled && loading ? (
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
  getTokenPrice,
  swapEthForExactTokens,
  swapExactEthForTokens,
  checkAllowance,
  confirmAllowance,
})(SwapCard);
