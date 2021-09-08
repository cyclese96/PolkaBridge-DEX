import React from "react";
import useStyles from "./styles";
import TopTokens from "./TopTokens";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import PercentLabel from "../../common/PercentLabel";
import { Card } from "@material-ui/core";

const Analytics = () => {
  const classes = useStyles();

  return (
    <div>
      <p className={classes.heading}>PolkaBridge DEX Overview</p>

      <div className="row g-3">
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            <span className={classes.cardSpan}>Total value locked</span>
            <p className={classes.cardP}>$1.4B</p>

            <div className={classes.chart}>
              <AreaChart />
            </div>
          </Card>
        </div>
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            <span className={classes.cardSpan}>Volume 24H</span>
            <p className={classes.cardP}>$ 992M</p>
            <div className={classes.chart}>
              <BarChart />
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
        <TopTokens tableType="TopTokens" />
      </div>
      <div className={classes.tokenListHeading}>Top Pools</div>
      <div className={classes.tokenList}>
        <TopTokens tableType="TopPools" />
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
