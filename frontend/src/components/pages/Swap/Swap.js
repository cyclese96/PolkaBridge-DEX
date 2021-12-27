import React, { useCallback, useEffect } from "react";
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
import CustomSnackBar from "../../common/CustomSnackbar";
import {
    allowanceAmount,
    BNB,
    ETH,
    etheriumNetwork,
    swapFnConstants,
    THRESOLD_VALUE,
} from "../../../constants";
import { fromWei, getPriceRatio, toWei } from "../../../utils/helper";
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
import SwapConfirm from "../../common/SwapConfirm";
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
// import { useAllTokenData } from "../../contexts/TokenData";
import { useLocation } from "react-router";
import { usePrevious } from "react-use";

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
            width: "90%",
            maxWidth: 400,
            border: "1px solid #212121",
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
            fontSize: 22,
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
            fontSize: 16,
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

    const [selectedToken1, setToken1] = useState({});

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
    const [_token0PriceUSD, setToken0PriceUSD] = useState(null);
    const [_token1PriceUSD, setToken1PriceUSD] = useState(null);

    // const allTokens = useAllTokenData();

    const query = new URLSearchParams(useLocation().search);

    // useEffect(() => {
    //   if (!allTokens) {
    //     return
    //   }

    //   setToken0PriceUSD(allTokens?.[selectedToken1.address?.toLowerCase()]?.priceUSD)
    //   setToken1PriceUSD(allTokens?.[selectedToken2.address?.toLowerCase()]?.priceUSD)

    // }, [allTokens, selectedToken2, selectedToken1])

    const getTokenToSelect = (tokenQuery) => {
        const token =
            tokenQuery &&
            tokenList &&
            tokenList.find(
                (item) =>
                    item.symbol.toUpperCase() === tokenQuery.toUpperCase() ||
                    item.address.toLowerCase() === tokenQuery.toLowerCase()
            );

        if (token && token.symbol) {
            return token;
        }

        return {};
    };

    useEffect(() => {
        async function initSelection() {
            setLocalStateLoading(true);

            const [token0Query, token1Query] = [
                query.get("inputCurrency"),
                query.get("outputCurrency"),
            ];

            if (currentNetwork === etheriumNetwork) {
                if (token0Query) {
                    const _token = getTokenToSelect(token0Query);

                    if (!_token || !_token.symbol) {
                        importToken(token0Query, currentAccount, currentNetwork);
                    }

                    setToken1(_token);
                } else {
                    const _token = getTokenToSelect(ETH);
                    setToken1(_token);
                }

                if (token1Query) {
                    const _token = getTokenToSelect(token1Query);

                    if (!_token || !_token.symbol) {
                        importToken(token1Query, currentAccount, currentNetwork);
                    }

                    setToken2(_token);
                }
            } else {
                const _token = getTokenToSelect(BNB);
                setToken1(_token);
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

            if (!selectedToken1.symbol || !selectedToken2.symbol) {
                localStorage.priceTracker = "None";
                clearInputState();
            }

            if (selectedToken1.symbol) {
                await getAccountBalance(selectedToken1, currentNetwork);
            }

            if (selectedToken2.symbol) {
                await getAccountBalance(selectedToken2, currentNetwork);
            }

            if (selectedToken1.symbol && selectedToken2.symbol) {
                // reset token input on token selection
                clearInputState();

                await checkAllowance(selectedToken1, currentAccount, currentNetwork);

                setLocalStateLoading(false);
            }
        }
        loadPair();
        setLocalStateLoading(false);
    }, [selectedToken1, selectedToken2, currentNetwork, currentAccount]);

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

        if (selectedToken1.symbol === ETH) {
            setCurrentSwapFn(swapFnConstants.swapExactETHForTokens);
        } else if (selectedToken2.symbol && selectedToken2.symbol === ETH) {
            setCurrentSwapFn(swapFnConstants.swapExactTokensForETH);
        } else {
            setCurrentSwapFn(swapFnConstants.swapExactTokensForTokens);
        }

        // calculate resetpective value of token 2 if selected
        let _token2Value = "";
        // const pairAddress = currentPairAddress();

        if (selectedToken2.symbol && new BigNumber(tokens).gt(0)) {
            debouncedToken1OutCall(
                { ...selectedToken1, amount: toWei(tokens, selectedToken1.decimals) },
                selectedToken2,
                currentAccount,
                currentNetwork
            );
        } else if (selectedToken2.symbol && !tokens) {
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

        if (selectedToken1.symbol === ETH) {
            setCurrentSwapFn(swapFnConstants.swapETHforExactTokens);
        } else if (selectedToken2.symbol && selectedToken2.symbol === ETH) {
            setCurrentSwapFn(swapFnConstants.swapTokensForExactETH);
        } else {
            setCurrentSwapFn(swapFnConstants.swapTokensForExactTokens);
        }

        //calculate respective value of token1 if selected

        if (selectedToken1.symbol && new BigNumber(tokens).gt(0)) {
            debouncedToken0InCall(
                selectedToken1,
                { ...selectedToken2, amount: toWei(tokens, selectedToken2.decimals) },
                currentAccount,
                currentNetwork
            );
        } else if (selectedToken1.symbol && !tokens) {
            setToken1Value("");
            if (!swapStatus.disabled) {
                setStatus({ disabled: true, message: "Enter Amounts" });
            }
        }
    };

    //On tonen0 input: price update checks and output result updates
    const prevToken1Out = usePrevious(token2Value)
    useEffect(() => {

        if (!token1Out) {
            return;
        }

        if (localStorage.getItem("priceTracker") !== token1OutCalling) {
            return;
        }

        const _tokenAmount = token1Out.tokenAmount;
        if (new BigNumber(_tokenAmount).eq(prevToken1Out)) {
            return
        }

        setSwapPath(token1Out.selectedPath);

        if (new BigNumber(_tokenAmount).gt(0)) {
            setToken2Value(_tokenAmount);
            // verify swap status with current inputs
            verifySwapStatus(
                { value: token1Value, selected: selectedToken1 },
                { value: _tokenAmount, selected: selectedToken2 }
            );
        }

        setToken0PriceUSD(token1Out.token0UsdValue);
        setToken1PriceUSD(token1Out.token1UsdValue);

        // balance check before trade
        const _bal0 = Object.keys(balance).includes(selectedToken1.symbol)
            ? balance[selectedToken1.symbol]
            : 0;
        const bal0Wei = fromWei(_bal0, selectedToken1.decimals); //DECIMAL_6_ADDRESSES.includes(selectedToken1.address) ? fromWei(_bal0, 6) : fromWei(_bal0)
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
                selectedToken1.symbol &&
                selectedToken2.symbol &&
                new BigNumber(token1Value).gt(0)
            ) {
                const token1OutParams = [
                    {
                        ...selectedToken1,
                        amount: toWei(token1Value, selectedToken1.decimals),
                    },
                    selectedToken2,
                    currentAccount,
                    currentNetwork,
                ];
                console.log("calling token", token1OutParams);

                await debouncedToken1OutCall(...token1OutParams);
            }
        }, 1000);

    }, [token1Out]);


    //On token1 input: price update checks and output result updates
    const prevToken0In = usePrevious(token1Value)
    useEffect(() => {
        if (!token0In) {
            return;
        }

        if (localStorage.getItem("priceTracker") !== token0InCalling) {
            return;
        }

        const _tokenAmount = token0In.tokenAmount;
        if (new BigNumber(_tokenAmount).eq(prevToken0In)) {
            return
        }

        setSwapPath(token0In.selectedPath);

        if (new BigNumber(_tokenAmount).gt(0)) {
            setToken1Value(_tokenAmount);
            // verify swap status with current inputs
            verifySwapStatus(
                { value: _tokenAmount, selected: selectedToken1 },
                { value: token2Value, selected: selectedToken2 }
            );
        }

        setToken0PriceUSD(token0In.token0UsdValue);
        setToken1PriceUSD(token0In.token1UsdValue);

        // balance check before trade
        const _bal0 = Object.keys(balance).includes(selectedToken1.symbol)
            ? balance[selectedToken1.symbol]
            : 0;

        const bal0Wei = fromWei(_bal0, selectedToken1.decimals);

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
            if (localStorage.getItem('priceTracker') === token0InCalling && selectedToken1.symbol && selectedToken2.symbol && new BigNumber(token2Value).gt(0)) {
                const token0InParams = [
                    selectedToken1,
                    { ...selectedToken2, amount: toWei(token2Value, selectedToken2.decimals) },
                    currentAccount,
                    currentNetwork
                ]
                console.log('calling token', token0InParams)

                await debouncedToken0InCall(...token0InParams)
            }

        }, 1000)

    }, [token0In]);

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
        const _allowanceAmount = allowanceAmount;
        await confirmAllowance(
            _allowanceAmount,
            selectedToken1,
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

        store.dispatch({ type: SHOW_DEX_LOADING });
        impact = await calculatePriceImpact(
            token0,
            token1,
            currentAccount,
            currentNetwork
        );
        store.dispatch({ type: HIDE_DEX_LOADING });

        setPriceImpact(impact);
    };

    const hideSnackbar = () => {
        setAlert({ status: false });
    };

    // swap selected tokens and reset inputs
    const handleSwapInputs = () => {
        localStorage.priceTracker = "None";

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

    // swap status updates
    useEffect(() => {
        if (!transaction.hash && !transaction.type) {
            return;
        }

        if (transaction.type === "swap" && transaction.status === "success") {
            localStorage.priceTracker = "None";
            getAccountBalance(selectedToken1, currentNetwork);
            getAccountBalance(selectedToken2, currentNetwork);
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
                currenSwapPath={swapPath}
                priceRatio={priceRatio}
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
                        priceUSD={_token0PriceUSD}
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
                        priceUSD={_token1PriceUSD}
                    />

                    {token1Value && token2Value && (
                        <div
                            className="mt-2 d-flex justify-content-end"
                            style={{ width: "95%" }}
                        >
                            <div className={classes.tokenPrice}>
                                {selectedToken1.symbol &&
                                    selectedToken2.symbol &&
                                    !disableStatus() ? (
                                    <span style={{ paddingRight: 5 }}>
                                        1 {selectedToken1.symbol} {" = "}
                                        <NumberFormat
                                            displayType="text"
                                            value={priceRatio}
                                            decimalScale={5}
                                        />{" "}
                                        {selectedToken2.symbol}
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
    getToken0InAmount,
    getToken1OutAmount,
    importToken,
})(Swap);
