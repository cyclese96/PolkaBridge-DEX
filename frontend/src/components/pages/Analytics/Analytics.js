import React, { useEffect } from "react";
import useStyles from "./styles";
import TopTokens from "./TopTokens";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import PercentLabel from "../../common/PercentLabel";
import { Card } from "@material-ui/core";
import { topTransactions } from "../../../apollo/queries";
import { useGlobalChartData, useGlobalData } from "../../../contexts/GlobalData";
import { formattedPercent } from "../../../utils/timeUtils";
import { useAllTokenData } from "../../../contexts/TokenData";
import { useAllPairData } from "../../../contexts/PairData";
import millify from "millify";
import { formatCurrency } from "../../../utils/helper";
// import { useLatestBlocks } from "../../../contexts/Application";
// import { useGlobalData } from "../../../contexts/GlobalData";

// globalData ->
// {
//   "id": "0xA1853078D1447C0060c71a672E6D13882f61A0a6",
//   "totalVolumeUSD": "25990.233499252762817",
//   "totalVolumeETH": "7.425780999786503662",
//   "untrackedVolumeUSD": "28387.02699820012448427415396166343",
//   "totalLiquidityUSD": 113078.18050507178,
//   "totalLiquidityETH": "32.30805157287764869",
//   "txCount": "59",
//   "pairCount": 5,
//   "__typename": "PolkabridgeAmmFactory",
//   "oneDayVolumeUSD": 437.8250777427784,
//   "oneWeekVolume": 2611.150077742779,
//   "weeklyVolumeChange": -85.87440846623471,
//   "volumeChangeUSD": 0,
//   "liquidityChangeUSD": 5.726158284194191,
//   "oneDayTxns": 2,
//   "txnChange": 0
// }
const Analytics = () => {
  const classes = useStyles();


  const allPairs = useAllPairData()
  const allTokens = useAllTokenData()
  const globalData = useGlobalData()

  const chartData = useGlobalChartData()

  useEffect(async () => {
    const page = 1;
    const order = 'desc';
    const transactions = await topTransactions(page, order)
    // console.log('transactions ', transactions)
  }, [])
  return (
    <div>
      <p className={classes.heading}>PolkaBridge DEX Overview</p>

      <div className="row g-3">
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            <span className={classes.cardSpan}>Total value locked</span>
            <p className={classes.cardP}>
              {globalData.totalLiquidityUSD
                ? formatCurrency(globalData.totalLiquidityUSD, false, 0, false)
                : "-"}{" "}
              <small>
                {globalData.liquidityChangeUSD
                  ? formattedPercent(globalData.liquidityChangeUSD)
                  : "-"}
              </small>{" "}
            </p>

            <div className={classes.chart}>
              <AreaChart chartData={chartData ? chartData[0] : []} />
            </div>
          </Card>
        </div>
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            <span className={classes.cardSpan}>Volume 24H</span>
            <p className={classes.cardP}>
              {console.log(globalData)}
              {globalData.oneDayVolumeUSD
                ? formatCurrency(globalData.oneDayVolumeUSD, true, 1, true)
                : "-"}
              <small>
                {globalData.volumeChangeUSD !== null
                  ? formattedPercent(globalData.volumeChangeUSD)
                  : "-"}
              </small>{" "}
            </p>
            <div className={classes.chart}>
              <BarChart chartData={chartData ? chartData[0] : []} />
            </div>
          </Card>
        </div>
      </div>

      <Card elevetation={10} className={classes.priceStatContainer}>
        <div className={classes.statsGroup}>
          <span className={classes.statLabel}>Volume 24H:</span>
          <span className={classes.statAmount}>$992.04M</span>

          <PercentLabel percentValue={5} braces={true} />
        </div>

        <div className={classes.statsGroup}>
          <span className={classes.statLabel}>Fees 24H:</span>
          <span className={classes.statAmount}>$1.24M</span>

          <PercentLabel percentValue={8} braces={true} />
        </div>

        <div className={classes.statsGroup}>
          <span className={classes.statLabel}>Volume 24H:</span>
          <span className={classes.statAmount}>$1.6B</span>

          <PercentLabel percentValue={-8} braces={true} />
        </div>
      </Card>

      <div className={classes.tokenListHeading}>Top Tokens</div>
      <div className={classes.tokenList}>
        <TopTokens tableType="TopTokens" allTokens={allTokens} />
      </div>
      <div className={classes.tokenListHeading}>Top Pools</div>
      <div className={classes.tokenList}>
        <TopTokens tableType="TopPools" allPairs={allPairs} />
      </div>
      <div className={classes.tokenListHeading}>Transactions</div>
      <div className={classes.tokenList}>
        <TopTokens tableType="Transactions" />
      </div>
      <div className="mb-5"></div>
    </div>
  );
};

export default Analytics;
