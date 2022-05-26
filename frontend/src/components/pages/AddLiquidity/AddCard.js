import { Button, Card, IconButton, makeStyles } from "@material-ui/core";
import { connect, useSelector } from "react-redux";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useCallback, useEffect, useMemo, useState } from "react";
import SwapSettings from "../../common/SwapSettings";
import SwapCardItem from "../Swap/SwapCardItem";
import AddIcon from "@material-ui/icons/Add";
import {
  allowanceAmount,
  corgibAllowance,
  DEFAULT_POOL_TOKENS,
  liquidityPoolConstants,
  NATIVE_TOKEN,
} from "../../../constants/index";
import {
  fromWei,
  getPercentage,
  getPriceRatio,
  getTokenOutWithReserveRatio,
  getTokenToSelect,
  toWei,
} from "../../../utils/helper";
import {
  addLiquidityEth,
  checkAllowance,
  confirmAllowance,
  getPoolShare,
  getLpBalance,
  loadPairAddress,
  addLiquidity,
  importToken,
} from "../../../actions/dexActions";
import BigNumber from "bignumber.js";
import store from "../../../store";
import { RESET_POOL_SHARE, START_TRANSACTION } from "../../../actions/types";
import debounce from "lodash.debounce";
import {
  getPairAddress,
  useWalletConnectCallback,
} from "../../../utils/connectionUtils";
import { Settings } from "@material-ui/icons";
import TransactionConfirm from "../../common/TransactionConfirm";
import { useTokenData } from "../../../contexts/TokenData";
import { useLocation } from "react-router-dom";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useCurrencyBalances } from "hooks/useBalance";
import { Token } from "polkabridge-sdk";
import { isAddress } from "utils/contractUtils";
import { wrappedCurrency } from "hooks/wrappedCurrency";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "96%",
    maxWidth: 500,
    borderRadius: 15,
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 20,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 5,
      paddingRight: 5,
      width: "95%",
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardHeading: {
    paddingTop: 5,
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.palette.primary.iconColor,

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
    color: theme.palette.primary.iconColor,

    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 2,
  },
  settingIcon: {
    color: theme.palette.primary.iconColor,
    fontSize: 22,
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
    },
  },
  addIcon: {
    color: theme.palette.primary.iconColor,
    marginTop: -12,
    marginBottom: -12,
    borderRadius: "36%",

    transition: "all 0.4s ease",
    fontSize: 28,
    padding: 4,
    backgroundColor: theme.palette.primary.iconBack,
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
    border: "0.5px solid rgba(224, 224, 224, 0.8)",
    borderRadius: 10,
    "&:hover": {
      background: "rgba(250, 250, 250, 0.1)",
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
    color: theme.palette.textColors.subheading,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  feeSelectHeadingSpan: {
    color: "rgba(223, 9, 124,1)",
    fontSize: 11,
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
    },
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
    fontSize: 18,
    color: theme.palette.textColors.heading,

    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  cardTitle: {
    fontSize: 16,

    color: theme.palette.textColors.subheading,

    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  hintStyle: {
    fontSize: 13,
    color: theme.palette.textColors.subheading,

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
      marginTop: 5,
      fontSize: 15,
    },
  },
}));

const AddCard = (props) => {
  const {
    dex: {
      swapSettings,
      approvedTokens,
      poolReserves,
      pairContractData,
      transaction,
      tokenList,
    },
    addLiquidityEth,
    checkAllowance,
    confirmAllowance,
    getPoolShare,
    handleBack,
    getLpBalance,
    loadPairAddress,
    addLiquidity,
    importToken,
  } = props;

  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken0, setToken0] = useState({});
  const [selectedToken1, setToken1] = useState({});
  const [token1Value, setToken1Value] = useState("");
  const [token2Value, setToken2Value] = useState("");
  const [localStateLoading, setLocalStateLoading] = useState(false);

  const [swapDialogOpen, setSwapDialog] = useState(false);
  const [connectWallet] = useWalletConnectCallback();
  const [inputType, setInputType] = useState(liquidityPoolConstants.exactIn);

  // selected token usd value track
  const token0PriceData = useTokenData(
    selectedToken0.address ? selectedToken0.address.toLowerCase() : null
  );
  const token1PriceData = useTokenData(
    selectedToken1.address ? selectedToken1.address.toLowerCase() : null
  );

  const token0PriceUsd = useMemo(() => {
    if (!selectedToken0?.symbol || !token0PriceData) {
      return 0;
    }

    return token0PriceData?.priceUSD;
  }, [token0PriceData, selectedToken0]);

  const token1PriceUsd = useMemo(() => {
    if (!selectedToken1?.symbol || !token1PriceData) {
      return 0;
    }

    return token1PriceData?.priceUSD;
  }, [token1PriceData, selectedToken1]);

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const query = new URLSearchParams(useLocation().search);

  const { chainId, active, account } = useActiveWeb3React();

  const handleTokenImport = useCallback(
    (_tokenAddress) => {
      importToken(_tokenAddress, chainId);
    },
    [chainId, importToken]
  );

  const [token0Query, token1Query] = [
    query.get("inputCurrency"),
    query.get("outputCurrency"),
  ];

  const selectedChain = useSelector((state) => state.account?.currentChain);

  useEffect(() => {
    async function initSelection() {
      if (token0Query) {
        const _token = getTokenToSelect(tokenList, token0Query);

        if (!_token || !_token.symbol) {
          handleTokenImport(token0Query);
        }
        setToken0(_token);
      } else {
        const _token = getTokenToSelect(
          tokenList,
          DEFAULT_POOL_TOKENS?.[selectedChain]?.[0]
        );
        setToken0(_token);
      }

      if (token1Query) {
        const _token = getTokenToSelect(tokenList, token1Query);

        if (!_token || !_token.symbol) {
          handleTokenImport(token1Query);
        }

        setToken1(_token);
      } else {
        const _token = getTokenToSelect(
          tokenList,
          DEFAULT_POOL_TOKENS?.[selectedChain]?.[1]
        );
        setToken1(_token);
      }
    }
    initSelection();
  }, [
    chainId,
    account,
    tokenList,
    handleTokenImport,
    token1Query,
    token0Query,
  ]);

  const currentPairAddress = useMemo(() => {
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
  }, [pairContractData, selectedToken0, selectedToken1]);

  const token0Approved = useMemo(() => {
    if (selectedToken0?.symbol === NATIVE_TOKEN?.[chainId]) {
      return true;
    }
    return approvedTokens && approvedTokens?.[selectedToken0?.symbol];
  }, [selectedToken0, approvedTokens]);

  const token1Approved = useMemo(() => {
    if (selectedToken1?.symbol === NATIVE_TOKEN?.[chainId]) {
      return true;
    }
    return approvedTokens && approvedTokens?.[selectedToken1?.symbol];
  }, [approvedTokens, selectedToken1]);

  const isBothTokensApproved = useMemo(() => {
    return token0Approved && token1Approved;
  }, [token0Approved, token1Approved]);

  const currApproveBtnText = useMemo(() => {
    if (!token0Approved) {
      return `Approve ${selectedToken0.symbol}`;
    }

    return `Approve ${selectedToken1.symbol}`;
  }, [token0Approved, token1Approved, selectedToken0, selectedToken1]);

  const clearInputState = () => {
    setToken1Value("");
    setToken2Value("");
  };

  const loadPairReserves = async () => {
    let _pairAddress = currentPairAddress;

    if (!_pairAddress) {
      _pairAddress = await getPairAddress(
        selectedToken0.address,
        selectedToken1.address,
        chainId
      );

      loadPairAddress(
        selectedToken0.symbol,
        selectedToken1.symbol,
        _pairAddress,
        chainId
      );
    }

    if (!_pairAddress) {
      //pair not yet created in the factory
    } else {
      await getLpBalance(
        selectedToken0,
        selectedToken1,
        _pairAddress,
        account,
        chainId
      );
    }
  };

  // new use effect
  useEffect(() => {
    async function loadPair() {
      if (selectedToken0.symbol && selectedToken1.symbol) {
        setLocalStateLoading(true);
        clearInputState();

        await Promise.all([
          loadPairReserves(),
          checkAllowance(selectedToken0, account, chainId),
          checkAllowance(selectedToken1, account, chainId),
        ]);

        setLocalStateLoading(false);
      }
    }

    loadPair();
  }, [selectedToken0, selectedToken1, chainId, account]);

  const handleConfirmAllowance = async () => {
    const _allowanceAmount = allowanceAmount;
    if (!approvedTokens[selectedToken0.symbol]) {
      await confirmAllowance(
        selectedToken0?.symbol === "CORGIB"
          ? corgibAllowance
          : _allowanceAmount,
        selectedToken0,
        account,
        chainId
      );
    } else {
      await confirmAllowance(
        selectedToken1?.symbol === "CORGIB"
          ? corgibAllowance
          : _allowanceAmount,
        selectedToken1,
        account,
        chainId
      );
    }
  };

  const debouncedPoolShareCall = useCallback(() => {
    debounce((...params) => getPoolShare(...params), 1000);
  }, []);

  const debouncedGetLpBalance = useCallback(() => {
    debounce((...params) => getLpBalance(...params), 1000);
  }, []);

  const onToken1InputChange = (tokens) => {
    setToken1Value(tokens);

    const pairAddress = currentPairAddress;

    setInputType(liquidityPoolConstants.exactIn);

    if (selectedToken1.symbol && tokens && pairAddress) {
      debouncedGetLpBalance(
        selectedToken0,
        selectedToken1,
        pairAddress,
        account,
        chainId
      );
    }
  };

  const onToken2InputChange = (tokens) => {
    setToken2Value(tokens);

    const pairAddress = currentPairAddress;

    setInputType(liquidityPoolConstants.exactOut);

    if (selectedToken0.symbol && tokens && pairAddress) {
      debouncedGetLpBalance(
        selectedToken0,
        selectedToken1,
        pairAddress,
        account,
        chainId
      );
    }
  };

  const parsedToken1Value = useMemo(() => {
    if (inputType === liquidityPoolConstants.exactIn || !currentPairAddress) {
      return token1Value;
    }

    if (
      new BigNumber(poolReserves[selectedToken0.symbol]).lte(0) ||
      new BigNumber(poolReserves[selectedToken1.symbol]).lte(0)
    ) {
      return token1Value;
    }
    if (!token2Value) {
      return "";
    }

    const _tokenValue = getTokenOutWithReserveRatio(
      token2Value,
      fromWei(poolReserves[selectedToken0.symbol], selectedToken0.decimals),
      fromWei(poolReserves[selectedToken1.symbol], selectedToken1.decimals)
    );

    return _tokenValue;
  }, [
    token1Value,
    token2Value,
    poolReserves,
    inputType,
    selectedToken0,
    selectedToken1,
    currentPairAddress,
  ]);

  const parsedToken2Value = useMemo(() => {
    if (inputType === liquidityPoolConstants.exactOut || !currentPairAddress) {
      return token2Value;
    }

    if (
      new BigNumber(poolReserves[selectedToken0.symbol]).lte(0) ||
      new BigNumber(poolReserves[selectedToken1.symbol]).lte(0)
    ) {
      return token2Value;
    }

    if (!token1Value) {
      return "";
    }

    const _token2Value = getTokenOutWithReserveRatio(
      token1Value,
      fromWei(poolReserves[selectedToken1.symbol], selectedToken1.decimals),
      fromWei(poolReserves[selectedToken0.symbol], selectedToken0.decimals)
    );

    return _token2Value;
  }, [
    token1Value,
    token2Value,
    poolReserves,
    inputType,
    selectedToken0,
    selectedToken1,
    currentPairAddress,
  ]);

  const resetInput = () => {
    setToken1Value("");
    setToken2Value("");
    store.dispatch({ type: RESET_POOL_SHARE });
  };

  const onToken1Select = (token) => {
    setToken0(token);
    // resetInput();
  };

  const onToken2Select = (token) => {
    setToken1(token);
    // resetInput();
  };

  const handleClearState = () => {
    resetInput();
  };

  const handleAddLiquidity = async () => {
    if (
      selectedToken0.symbol === NATIVE_TOKEN?.[chainId] ||
      selectedToken1.symbol === NATIVE_TOKEN?.[chainId]
    ) {
      let etherToken, erc20Token;
      if (selectedToken0.symbol === NATIVE_TOKEN?.[chainId]) {
        etherToken = {
          ...selectedToken0,
          amount: parsedToken1Value,
        };

        const _amount = toWei(parsedToken2Value, selectedToken1.decimals);
        erc20Token = {
          ...selectedToken1,
          amount: _amount,
        };
      } else {
        etherToken = {
          ...selectedToken1,
          amount: parsedToken2Value,
        };

        const _amount = toWei(parsedToken1Value, selectedToken0.decimals);
        erc20Token = {
          ...selectedToken0,
          amount: _amount,
        };
      }

      await addLiquidityEth(
        etherToken,
        erc20Token,
        account,
        swapSettings.deadline,
        chainId
      );
    } else {
      // addLiquidity

      const _amount1 = toWei(parsedToken1Value, selectedToken0.decimals);
      const _amount2 = toWei(parsedToken2Value, selectedToken1.decimals);
      await addLiquidity(
        { ...selectedToken0, amount: _amount1 },
        { ...selectedToken1, amount: _amount2 },
        account,
        swapSettings.deadline,
        chainId
      );
    }

    await loadPairReserves();
  };

  const currentPoolShare = useMemo(() => {
    if (
      !poolReserves[selectedToken0.symbol] ||
      !poolReserves[selectedToken1.symbol]
    ) {
      return "100";
    }
    const token1Amount = toWei(parsedToken1Value);
    const token1Reserves = new BigNumber(poolReserves[selectedToken0.symbol]);
    const share = getPercentage(
      token1Amount,
      token1Reserves.plus(token1Amount).toString()
    );
    return share;
  }, [poolReserves, selectedToken0, selectedToken1, parsedToken1Value]);

  const handleAction = () => {
    if (!active) {
      connectWallet();
      return;
    }

    if (
      ["add", "token_approve"].includes(transaction.type) &&
      transaction.status === "pending" &&
      !swapDialogOpen
    ) {
      setSwapDialog(true);
      return;
    }

    if (isBothTokensApproved) {
      setSwapDialog(true);

      handleAddLiquidity();
    } else {
      setSwapDialog(true);

      handleConfirmAllowance();
    }
  };

  // wrapped curreny formats of selected token
  const wrappedCurrency0 = useMemo(() => {
    if (!selectedToken0.address || !chainId) {
      return undefined;
    }

    const _token = new Token(
      chainId,
      isAddress(selectedToken0?.address),
      selectedToken0.decimals,
      selectedToken0.symbol,
      selectedToken0.name
    );

    return wrappedCurrency(_token, chainId);
  }, [selectedToken0, chainId]);

  const wrappedCurrency1 = useMemo(() => {
    if (!selectedToken1.address || !chainId) {
      return undefined;
    }

    const _token = new Token(
      chainId,
      isAddress(selectedToken1?.address),
      selectedToken1.decimals,
      selectedToken1.symbol,
      selectedToken1.name
    );

    return wrappedCurrency(_token, chainId);
  }, [selectedToken1, chainId]);

  const currencyBalances = useCurrencyBalances(account, [
    wrappedCurrency0,
    wrappedCurrency1,
  ]);

  const currentAddLiquidityStatus = useMemo(() => {
    if (!active) {
      return { currentBtnText: "Connect Wallet", disabled: false };
    }

    if (localStateLoading) {
      return { currentBtnText: "Please wait...", disabled: true };
    }

    if (
      ["add", "token_approve"].includes(transaction.type) &&
      transaction.status === "pending"
    ) {
      return { currentBtnText: "Pending Transaction...", disabled: true };
    }

    if (
      new BigNumber(parsedToken1Value || 0).eq(0) ||
      new BigNumber(parsedToken2Value || 0).eq(0)
    ) {
      return { currentBtnText: "Enter token amounts", disabled: true };
    }

    const bal0 = !currencyBalances?.[0]
      ? "0"
      : currencyBalances?.[0]?.toExact();
    const bal1 = !currencyBalances?.[1]
      ? "0"
      : currencyBalances?.[1]?.toExact();
    if (
      new BigNumber(parsedToken1Value).gt(bal0) ||
      new BigNumber(parsedToken2Value).gt(bal1)
    ) {
      return { currentBtnText: "Insufficient funds!", disabled: true };
    }

    if (!isBothTokensApproved) {
      return { currentBtnText: currApproveBtnText, disabled: false };
    }

    return { currentBtnText: "Add liquidity", disabled: false };
  }, [
    currApproveBtnText,
    active,
    localStateLoading,
    transaction,
    isBothTokensApproved,
    currencyBalances,
    parsedToken1Value,
    parsedToken2Value,
  ]);

  // liquidity transaction status updates
  useEffect(() => {
    if (!transaction.hash && !transaction.type) {
      return;
    }

    if (
      ["add", "token_approve"].includes(transaction.type) &&
      transaction.status === "pending"
    ) {
      setSwapDialog(true);
    }

    if (
      (["add", "token_approve"].includes(transaction.type) &&
        transaction.status === "success") ||
      transaction.status === "failed"
    ) {
      setSwapDialog(true);
    }
  }, [transaction]);

  const handleConfirmSwapClose = (value) => {
    setSwapDialog(value);
    if (
      ["add", "token_approve"].includes(transaction.type) &&
      transaction.status === "success"
    ) {
      store.dispatch({ type: START_TRANSACTION });
      // clearInputState();
    } else if (
      ["add", "token_approve"].includes(transaction.type) &&
      transaction.status === "failed"
    ) {
      store.dispatch({ type: START_TRANSACTION });
    }
  };

  return (
    <>
      <SwapSettings open={settingOpen} handleClose={close} />
      <TransactionConfirm
        open={swapDialogOpen}
        handleClose={() => handleConfirmSwapClose(false)}
        selectedToken0={selectedToken0}
        selectedToken1={selectedToken1}
        token1Value={token1Value}
        token2Value={token2Value}
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
            currentToken={selectedToken0}
            disableToken={selectedToken1}
            inputValue={parsedToken1Value}
            priceUSD={token0PriceUsd}
            currenryBalance={currencyBalances?.[0]?.toExact()}
          />
          <IconButton className={classes.iconButton}>
            <AddIcon fontSize="default" className={classes.addIcon} />
          </IconButton>

          <SwapCardItem
            onInputChange={onToken2InputChange}
            onTokenChange={onToken2Select}
            currentToken={selectedToken1}
            disableToken={selectedToken0}
            inputValue={parsedToken2Value}
            priceUSD={token1PriceUsd}
            currenryBalance={currencyBalances?.[1]?.toExact()}
          />

          {selectedToken0.symbol && selectedToken1.symbol ? (
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
                    {`${selectedToken0.symbol} per ${selectedToken1.symbol}`}
                  </span>
                </div>

                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {getPriceRatio(token2Value, token1Value)}
                  </div>
                  <span className={classes.feeSelectHeadingSpan}>
                    {`${selectedToken1.symbol} per ${selectedToken0.symbol}`}
                  </span>
                </div>

                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {`${currentPoolShare}%`}
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
            disabled={currentAddLiquidityStatus.disabled}
            onClick={handleAction}
            className={classes.addLiquidityButton}
          >
            {currentAddLiquidityStatus.currentBtnText}
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
  loadPairAddress,
  addLiquidity,
  importToken,
})(AddCard);
