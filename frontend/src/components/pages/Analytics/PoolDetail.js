import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useTokenChartData,
  useTokenData,
  useTokenPriceData,
} from "../../../contexts/TokenData";
import { useEffect } from "react/cjs/react.development";
import { usePrevious } from "react-use";
import { usePairData, usePairTransactions } from "../../../contexts/PairData";
import { formattedNum, formattedPercent } from "../../../utils/timeUtils";
import { useEthPrice } from "../../../contexts/GlobalData";
import { Card } from "@material-ui/core";
import TokenIcon from "../../common/TokenIcon";
import { formatCurrency } from "../../../utils/helper";
import TokenChart from "./TokenChart";
import TopTokens from "./TopTokens";

const useStyles = makeStyles((theme) => ({
  background: {
    padding: 30,
  },
  breadcrumbs: {
    paddingBottom: 20,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 10,
    },
  },
  breadcrumbsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: 400,
  },
  tokenDetails: {
    paddingTop: 20,
    paddingBottom: 16,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 5,
    },
  },
  tokenTitle: {
    color: "white",
    fontSize: 32,
    [theme.breakpoints.down("sm")]: {
      fontSize: 17,
    },
  },
  tokenImage: {
    height: 30,
    marginRight: 10,
  },
  changeIndicator: {
    background: "green",
    color: "white",
    fontSize: 12,
    marginLeft: 10,
    borderRadius: 7,
    padding: "4px 8px 4px 8px",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 400,
    color: "white",
    paddingTop: 5,
    paddingBottom: 10,
  },
  liquidityCard: {
    height: 120,
    width: "100%",
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 10,
    border: "1px solid #616161",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    textAlign: "left",
    paddingBottom: 7,
  },
  cardValue: {
    color: "white",
    fontSize: 26,
    textAlign: "left",
  },
  cardChangeIndicator: {
    color: "green",
    fontSize: 12,
  },
  chartsCard: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 10,
    border: "1px solid #616161",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
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
  } = usePairData(pairAddress);

  const transactions = usePairTransactions(pairAddress);

  useEffect(() => {
    console.log("alltransaction", transactions);
  }, [transactions]);

  const formattedLiquidity = reserveUSD
    ? formattedNum(reserveUSD, true)
    : formattedNum(trackedReserveUSD, true);
  const usingUntrackedLiquidity = !trackedReserveUSD && !!reserveUSD;
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // volume
  const volume = !!oneDayVolumeUSD
    ? formattedNum(oneDayVolumeUSD, true)
    : formattedNum(oneDayVolumeUntracked, true);
  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked;
  const volumeChange = formattedPercent(
    !usingUtVolume ? volumeChangeUSD : volumeChangeUntracked
  );

  const showUSDWaning = usingUntrackedLiquidity | usingUtVolume;

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : "-";

  // token data for usd
  const [ethPrice] = useEthPrice();
  const token0USD =
    token0?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true)
      : "";

  const token1USD =
    token1?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true)
      : "";

  // rates
  const token0Rate =
    reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : "-";
  const token1Rate =
    reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : "-";

  // formatted symbols for overflow
  const formattedSymbol0 =
    token0?.symbol.length > 6
      ? token0?.symbol.slice(0, 5) + "..."
      : token0?.symbol;
  const formattedSymbol1 =
    token1?.symbol.length > 6
      ? token1?.symbol.slice(0, 5) + "..."
      : token1?.symbol;

  const classes = useStyles();
  return (
    <div className="container">
      <div className={classes.background}>
        <div for="breadcrumbs" className={classes.breadcrumbs}>
          <h6 className={classes.breadcrumbsTitle}>
            Pair →{" "}
            <span>
              {token0.symbol} - {token1.symbol}
              <a
                style={{ color: "#DF097C", paddingLeft: 5 }}
                target="_blank"
                href={`https://rinkeby.etherscan.io/address/${pairAddress}`}
              >
                ({pairAddress && pairAddress.slice(0, 8)})
              </a>
            </span>
          </h6>
        </div>
        <div for="token-details" className={classes.tokenDetails}>
          <h1 className={classes.tokenTitle}>
            <TokenIcon
              symbol={token0.symbol}
              address={token0.address}
              className={classes.tokenImage}
            />
            <TokenIcon
              symbol={token1.symbol}
              address={token1.address}
              className={classes.tokenImage}
            />
            <span style={{ paddingRight: 3 }}>
              {token0.symbol} - {token1.symbol}
            </span>
            {/* <span style={{ paddingRight: 15 }}>({symbol})</span> */}
            <span>${formatCurrency(token1USD)}</span>
            <span className={classes.changeIndicator}>
              ${formatCurrency(token1Rate)}
            </span>
          </h1>
        </div>
        <div for="token-stats">
          <h6 className={classes.sectionTitle}>Token Statistics</h6>
          <div className="row">
            <div className="col-md-4">
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Total Liquidity</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>
                    {formatCurrency(trackedReserveUSD)}
                  </h6>
                  <p className={classes.cardChangeIndicator}>
                    {liquidityChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Volume (24Hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{oneDayVolumeUSD}</h6>
                  <p className={classes.cardChangeIndicator}>
                    {volumeChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Fees (24hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{fees}</h6>
                  <p className={classes.cardChangeIndicator}>
                    {volumeChangeUSD}%
                  </p>
                </div>
              </Card>
            </div>
            <div className="col-md-8">
              <Card elevation={10} className={classes.chartsCard}>
                <div>
                  <TokenChart
                    address={pairAddress}
                    color={"#E0077D"}
                    base={0}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div for="transaction-table" className="mt-5">
          <h6 className={classes.sectionTitle}>Top Transactions</h6>
          <div>
            <div className={classes.tokenList}>
              {/* <TopTokens//todo: fix transaction api then it works
                tableType="Transactions"
                allTransactions={!transactions ? {} : transactions}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PoolDetail;
