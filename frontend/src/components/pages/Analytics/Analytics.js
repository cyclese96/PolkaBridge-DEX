import React from "react";
import useStyles from "./styles";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import TopTokens from "./TopTokens";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";

const Analytics = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <p>Polkabridge Dex Overview</p>

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
              <div className={classes.statPercentageGreen}>
                {"("}
                <ArrowUpwardIcon
                  fontSize="small"
                  className={classes.arrowIcon}
                />
                <span>8%</span>
                {")"}
              </div>
            </div>

            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>Volume 24H:</span>
              <span className={classes.statAmount}>$992.04M</span>
              <div className={classes.statPercentageGreen}>
                {"("}
                <ArrowUpwardIcon
                  fontSize="small"
                  className={classes.arrowIcon}
                />
                <span>8%</span>
                {")"}
              </div>
            </div>

            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>Volume 24H:</span>
              <span className={classes.statAmount}>$992.04M</span>
              <div className={classes.statPercentageRed}>
                {"("}
                <ArrowDownwardIcon
                  fontSize="small"
                  className={classes.arrowIcon}
                />
                <span>8%</span>
                {")"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.tokenListHeading}>Top Tokens</div>
      <div className={classes.tokenList}>
        <TopTokens />
      </div>
    </div>
  );
};

export default Analytics;
