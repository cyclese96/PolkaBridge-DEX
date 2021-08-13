import React from "react";
import useStyles from "./styles";
import TopTokens from "./TopTokens";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import PercentLabel from "../../common/PercentLabel";

const Analytics = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <p>AMM Overview</p>

      <div className={classes.cardsContainer}>
        <div className={classes.card}>
          <div className="card-theme">
            <div className={classes.cardContainer}>
              <span className={classes.cardSpan}>Total value locked</span>
              <p className={classes.cardP}>$1.4B</p>
              <small className={classes.cardSmall}>Jul 7 2021</small>
              <div className={classes.chart}>
                <AreaChart />
              </div>
            </div>
          </div>
        </div>

        <div className={classes.card}>
          <div className="card-theme">
            <div className={classes.cardContainer}>
              <span className={classes.cardSpan}>Volume 24H</span>
              <p className={classes.cardP}>$ 992M</p>
              <small className={classes.cardSmall}>Jul 7 2021</small>
              <div className={classes.chart}>
                <BarChart />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.priceStatBar}>
        <div className="card-theme">
          <div className={classes.priceStatContainer}>
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
          </div>
        </div>
      </div>

      <div className={classes.tokenListHeading}>Top Tokens</div>
      <div className={classes.tokenList}>
        <TopTokens tableType="TopTokens" />
      </div>
      <div className={classes.tokenListHeading}>Top Pools</div>
      <div className={classes.tokenList}>
        <TopTokens tableType="TopPools" />
      </div>
      <div className={classes.tokenListHeading}>Transactions</div>
    </div>
  );
};

export default Analytics;
