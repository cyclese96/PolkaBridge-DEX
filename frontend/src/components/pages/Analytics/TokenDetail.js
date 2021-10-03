import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTokenChartData, useTokenData, useTokenPriceData } from '../../../contexts/TokenData'
import { useEffect } from "react/cjs/react.development";
import { usePrevious } from "react-use";


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


    // reset view on new address
    const addressPrev = usePrevious(address)
    useEffect(() => {
        if (address !== addressPrev && addressPrev) {
            // setChartFilter(CHART_VIEW.LIQUIDITY)
        }
    }, [address, addressPrev])

    let chartData = useTokenChartData(address)


    useEffect(() => {
        console.log('token chart data', chartData);
        console.log({
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
        })
    }, [chartData])
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
                                        $64,812,108
                                    </h3>
                                    <h6 className={classes.increasePercent}>+0.82%</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-4">
                            <div className={classes.cardLiquidity}>
                                <h6 className={classes.subTitle}>Total Liquidity</h6>
                                <div className="d-flex justify-content-between">
                                    <h3 style={{ color: "white", paddingLeft: 30 }}>
                                        $64,812,108
                                    </h3>
                                    <h6 className={classes.increasePercent}>+0.82%</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-sm-4">
                            <div className={classes.cardLiquidity}>
                                <h6 className={classes.subTitle}>Total Liquidity</h6>
                                <div className="d-flex justify-content-between">
                                    <h3 style={{ color: "white", paddingLeft: 30 }}>
                                        $64,812,108
                                    </h3>
                                    <h6 className={classes.increasePercent}>+0.82%</h6>
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