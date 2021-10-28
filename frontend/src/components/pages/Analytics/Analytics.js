import React, { useEffect } from "react";
import useStyles from "./styles";
import TopTokens from "./TopTokens";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import PercentLabel from "../../common/PercentLabel";
import { Card } from "@material-ui/core";
import {
  useGlobalChartData,
  useGlobalData,
  useGlobalTransactions,
} from "../../../contexts/GlobalData";
import { formattedPercent } from "../../../utils/timeUtils";
import { useAllTokenData } from "../../../contexts/TokenData";
import { useAllPairData } from "../../../contexts/PairData";
// import { formatCurrency } from "../../../utils/helper";
import Loader from "../../common/Loader";
import TabPage from "../../TabPage";
import { formatCurrency } from "../../../utils/formatters";
import BigNumber from "bignumber.js";

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

  const allPairs = useAllPairData();
  const allTokens = useAllTokenData();
  const transactions = useGlobalTransactions();
  const globalData = useGlobalData();

  const chartData = useGlobalChartData();

  // useEffect(() => {
  //   console.log("analyticsTest:  globalData load ", chartData);
  // }, [chartData]);

  // validator to display info when chart is not available

  const isValidGlobalChart = (_chartData, _globalData) => {

    let areaChartPrepared = false;
    let barChartPrepared = false;
    let globalDataLoaded = false;

    if (_chartData && chartData[0].length === 7) {
      areaChartPrepared = true
    }

    if (_chartData && chartData[0].length === 7) {
      barChartPrepared = true
    }


    if (globalData) {
      globalDataLoaded = true
    }

    return { areaChartPrepared, barChartPrepared, globalDataLoaded };
  }



  return (
    <div>
      <div className="mb-3">
        <TabPage data={2} />
      </div>
      <h3 className={classes.heading}>PolkaBridge DEX Overview</h3>

      <div className="mt-2 row g-3" style={{ padding: 10 }}>
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            {chartData && globalData && (
              <div>
                <span className={classes.cardSpan}>Total value locked</span>
                <p className={classes.cardP}>
                  {"$" + formatCurrency(!globalData ? "0" : globalData.totalLiquidityUSD)}
                  <small>
                    {formattedPercent(!globalData ? '0' : globalData.liquidityChangeUSD)}
                  </small>
                </p>
                <div className={classes.chart}>
                  <AreaChart chartData={chartData ? chartData[0] : []} />
                </div>
              </div>
            )}
            {!globalData && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <Loader />
              </div>
            )}
          </Card>
        </div>
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            {globalData !== null && (
              <div>
                <span className={classes.cardSpan}>Volume 24H</span>
                <p className={classes.cardP}>
                  {"$" + formatCurrency(!globalData ? '0' : globalData.oneDayVolumeUSD)}
                  <small>{formattedPercent(!globalData ? '0' : globalData.volumeChangeUSD)}</small>
                </p>
                <div className={classes.chart}>
                  <BarChart chartData={chartData ? chartData[0] : []} />
                </div>
              </div>
            )}
            {!globalData && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <Loader />
              </div>
            )}
          </Card>
        </div>
      </div>
      <div style={{ padding: 10 }}>
        {globalData && (
          <Card elevetation={10} className={classes.priceStatContainer}>
            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>Volume 24H:</span>
              <span className={classes.statAmount}>
                $ {formatCurrency(new BigNumber(globalData.oneDayVolumeUSD))}
              </span>

              <PercentLabel
                percentValue={globalData.volumeChangeUSD}
                braces={true}
              />
            </div>

            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>Fees 24H:</span>
              <span className={classes.statAmount}>
                $ {formatCurrency(globalData.oneDayVolumeUSD * 0.02)}
              </span>

              <PercentLabel
                percentValue={globalData.volumeChangeUSD}
                braces={true}
              />
            </div>

            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>TVL</span>
              <span className={classes.statAmount}>
                {"$" + formatCurrency(globalData.totalLiquidityUSD)}
              </span>

              <PercentLabel
                percentValue={globalData.liquidityChangeUSD}
                braces={true}
              />
            </div>
          </Card>
        )}
      </div>

      <div className={classes.tokenList}>
        <div style={{ padding: 10 }}>
          <div className={classes.tokenListHeading}>Top Tokens</div>
          <TopTokens
            tableType="TopTokens"
            allTokens={allTokens ? allTokens : {}}
          />
        </div>
      </div>

      <div className={classes.tokenList}>
        <div style={{ padding: 10 }}>
          <div className={classes.tokenListHeading}>Top Pools</div>
          <TopTokens tableType="TopPools" allPairs={allPairs ? allPairs : {}} />
        </div>
      </div>

      <div className={classes.tokenList}>
        <div style={{ padding: 10 }}>
          <div className={classes.tokenListHeading}>Transactions</div>
          <TopTokens
            tableType="Transactions"
            allTransactions={transactions ? transactions : {}}
          />
        </div>
      </div>
      <div className="mb-5"></div>
      {/* 

    
    */}
    </div>
  );
};

export default Analytics;
