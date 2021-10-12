import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTokenChartData, useTokenData, useTokenPriceData } from '../../../contexts/TokenData'
import { useEffect } from "react/cjs/react.development";
import { usePrevious } from "react-use";
import { usePairData, usePairTransactions } from "../../../contexts/PairData";
import { formattedNum, formattedPercent } from "../../../utils/timeUtils";
import { useEthPrice } from "../../../contexts/GlobalData";


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


function PoolDetail({ pairAddress }) {

    const {
        token0,
        token1,
        reserve0,
        reserve1,
        reserveUSD,
        trackedReserveUSD,
        oneDayVolumeUSD,
        volumeChangeUSD,
        oneDayVolumeUntracked,
        volumeChangeUntracked,
        liquidityChangeUSD,
    } = usePairData(pairAddress)


    const transactions = usePairTransactions(pairAddress)

    const formattedLiquidity = reserveUSD ? formattedNum(reserveUSD, true) : formattedNum(trackedReserveUSD, true)
    const usingUntrackedLiquidity = !trackedReserveUSD && !!reserveUSD
    const liquidityChange = formattedPercent(liquidityChangeUSD)

    // volume
    const volume = !!oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD, true) : formattedNum(oneDayVolumeUntracked, true)
    const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked
    const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUntracked)

    const showUSDWaning = usingUntrackedLiquidity | usingUtVolume

    // get fees	  // get fees
    const fees =
        oneDayVolumeUSD || oneDayVolumeUSD === 0
            ? usingUtVolume
                ? formattedNum(oneDayVolumeUntracked * 0.003, true)
                : formattedNum(oneDayVolumeUSD * 0.003, true)
            : '-'

    // token data for usd
    const [ethPrice] = useEthPrice()
    const token0USD =
        token0?.derivedETH && ethPrice ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true) : ''

    const token1USD =
        token1?.derivedETH && ethPrice ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true) : ''

    // rates
    const token0Rate = reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : '-'
    const token1Rate = reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : '-'

    // formatted symbols for overflow
    const formattedSymbol0 = token0?.symbol.length > 6 ? token0?.symbol.slice(0, 5) + '...' : token0?.symbol
    const formattedSymbol1 = token1?.symbol.length > 6 ? token1?.symbol.slice(0, 5) + '...' : token1?.symbol




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
                            {/* {` ${name}  (${symbol}) $${priceUSD}`} */}
                        </h1>
                    </div>
                </div>
                <div className="mt-3">
                    <h3 className={classes.heading}>Pair Stats</h3>
                </div>
                <div className="col-md-4">
                    <div className="container mt-4">
                        <div className="col-6 col-sm-4">
                            <div className={classes.cardLiquidity}>
                                <h6 className={classes.subTitle}>Total Liquidity</h6>
                                <div className="d-flex justify-content-between">
                                    <h3 style={{ color: "white", paddingLeft: 30 }}>
                                        {formattedLiquidity}
                                    </h3>
                                    <h6 className={classes.increasePercent}>{liquidityChange}</h6>
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
                                <h6 className={classes.subTitle}>{`Fee (24hrs)`}</h6>
                                <div className="d-flex justify-content-between">
                                    <h3 style={{ color: "white", paddingLeft: 30 }}>
                                        {fees}
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
export default PoolDetail;