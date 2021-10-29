import React, { useEffect } from "react";
import useStyles from "./styles";
import BarChart from "./components/Charts/BarChart";
import AreaChart from "./components/Charts/AreaChart";
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
import Loader from "../../common/Loader";
import TabPage from "../../TabPage";
import { formatCurrency } from "../../../utils/formatters";
import BigNumber from "bignumber.js";
import TopTokensTable from "./components/Tables/TopTokensTable";
import TopPoolsTable from "./components/Tables/TopPoolsTable";
import Transactions from "./components/Tables/TransactionsTable";

const Analytics = () => {
  const classes = useStyles();

  const allPairs = useAllPairData();
  const allTokens = useAllTokenData();
  const transactions = useGlobalTransactions();
  const globalData = useGlobalData();

  const chartData = useGlobalChartData();

  const isValidGlobalChart = (_chartData, _globalData) => {
    let areaChartPrepared = false;
    let barChartPrepared = false;
    let globalDataLoaded = false;

    if (_chartData && chartData[0].length === 7) {
      areaChartPrepared = true;
    }

    if (_chartData && chartData[0].length === 7) {
      barChartPrepared = true;
    }

    if (globalData) {
      globalDataLoaded = true;
    }

    return { areaChartPrepared, barChartPrepared, globalDataLoaded };
  };

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
                  {"$" +
                    formatCurrency(
                      !globalData ? "0" : globalData.totalLiquidityUSD
                    )}
                  <small>
                    {formattedPercent(
                      !globalData ? "0" : globalData.liquidityChangeUSD
                    )}
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
                  {"$" +
                    formatCurrency(
                      !globalData ? "0" : globalData.oneDayVolumeUSD
                    )}
                  <small>
                    {formattedPercent(
                      !globalData ? "0" : globalData.volumeChangeUSD
                    )}
                  </small>
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

      <div className="p-2">
        <div className={classes.tokenListHeading}>Top Tokens</div>
        <div className="d-flex justify-content-center ">
          <TopTokensTable data={allTokens} />
        </div>
      </div>

      <div className="p-2">
        <div className={classes.tokenListHeading}>Top Pools</div>
        <div className="d-flex justify-content-center">
          <TopPoolsTable data={allPairs} />
        </div>
      </div>

      <div className="p-2">
        <div className={classes.tokenListHeading}>Transactions</div>
        <div className="d-flex justify-content-center">
          <Transactions data={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
