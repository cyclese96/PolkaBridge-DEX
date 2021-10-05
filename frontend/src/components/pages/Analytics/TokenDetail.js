import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTokenChartData, useTokenData, useTokenPairs, useTokenPriceData, useTokenTransactions } from '../../../contexts/TokenData'
import { useEffect } from "react/cjs/react.development";
import { usePrevious } from "react-use";
import { useDataForList } from "../../../contexts/PairData";
import { formattedNum } from "../../../utils/formatters";
import { formattedPercent } from "../../../utils/timeUtils";


const useStyles = makeStyles((theme) => ({
    header: {
        width: 950,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 20,
    },
    title: {
        color: "white",
        paddingLeft: 30,
    },
    heading: {
        fontSize: 16,
        color: "white",
        paddingLeft: 20,
    },
    cardLiquidity: {
        height: 115,
        width: 400,
        background: "#19212D",
        borderRadius: 10,
        border: "2px solid grey",
        marginBottom: 10,
    },
    subTitle: {
        color: "white",
        paddingLeft: 30,
        marginTop: 20,
    },
    increasePercent: {
        color: "green",
        fontSize: 20,
        paddingRight: 30,
    },
    charts: {
        height: 370,
        width: 850,
        background: "#19212D",
        borderRadius: 10,
        border: "2px solid grey",
        marginBottom: 10,
    },
}));


function TokenPage({ address }) {

    const {
        id,
        name,
        symbol,
        priceUSD,
        oneDayVolumeUSD,
        totalLiquidityUSD,
        volumeChangeUSD,
        oneDayVolumeUT,
        volumeChangeUT,
        priceChangeUSD,
        liquidityChangeUSD,
        oneDayTxns,
        txnChange,
    } = useTokenData(address)

    const allPairs = useTokenPairs(address)

    // pairs to show in pair list
    const fetchedPairsList = useDataForList(allPairs)

    // all transactions with this token
    const transactions = useTokenTransactions(address)

    // price
    const price = priceUSD ? formattedNum(priceUSD, true) : ''
    const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : ''

    // volume
    const volume = formattedNum(!!oneDayVolumeUSD ? oneDayVolumeUSD : oneDayVolumeUT, true)

    const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT
    const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUT)

    // liquidity
    const liquidity = formattedNum(totalLiquidityUSD, true)
    const liquidityChange = formattedPercent(liquidityChangeUSD)

    // transactions
    const txnChangeFormatted = formattedPercent(txnChange)


    const classes = useStyles();
    return (
        <div className="container">
            <div className="row">
                <div className="header">
                    <div>
                        <h1 className={classes.title}>
                            <img
                                style={{ height: 35, width: 35, marginRight: 10 }}
                                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                            />
                            {` ${name}  (${symbol}) $${priceUSD}`}
                        </h1>
                    </div>
                </div>
                <div className="mt-3">
                    <h3 className={classes.heading}>Token Stats</h3>
                </div>
                <div className="col-md-4">
                    <div className="container mt-4">
                        <div className="col-6 col-sm-4">
                            <div className={classes.cardLiquidity}>
                                <h6 className={classes.subTitle}>Total Liquidity</h6>
                                <div className="d-flex justify-content-between">
                                    <h3 style={{ color: "white", paddingLeft: 30 }}>
                                        {totalLiquidityUSD}
                                    </h3>
                                    <h6 className={classes.increasePercent}>{liquidityChangeUSD}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-4">
                            <div className={classes.cardLiquidity}>
                                <h6 className={classes.subTitle}>{`Volume (24hrs)`}</h6>
                                <div className="d-flex justify-content-between">
                                    <h3 style={{ color: "white", paddingLeft: 30 }}>
                                        {volume}
                                    </h3>
                                    <h6 className={classes.increasePercent}>{volumeChangeUSD}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-4">
                            <div className={classes.cardLiquidity}>
                                <h6 className={classes.subTitle}>{`Fees (24hrs)`} </h6>
                                <div className="d-flex justify-content-between">
                                    <h3 style={{ color: "white", paddingLeft: 30 }}>
                                        {volume}
                                    </h3>
                                    <h6 className={classes.increasePercent}>{volumeChangeUSD}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="container mt-4">
                        <div className={classes.charts}>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TokenPage;