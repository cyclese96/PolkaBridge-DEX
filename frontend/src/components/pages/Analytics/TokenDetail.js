import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useTokenChartData,
  useTokenData,
  useTokenPairs,
  useTokenPriceData,
  useTokenTransactions,
} from "../../../contexts/TokenData";
import { useEffect } from "react/cjs/react.development";
import { usePrevious } from "react-use";
import { useAllPairData, useDataForList } from "../../../contexts/PairData";
import { formatCurrency, formattedNum } from "../../../utils/formatters";
import { formattedPercent } from "../../../utils/timeUtils";
import TokenLogo from "../../common/Styled/TokenLogo";
import TokenIcon from "../../common/TokenIcon";
import { Link } from "react-router-dom";
// import { formatCurrency } from "../../../utils/helper";
import TokenChart from "./TokenChart";
import { Button, Card } from "@material-ui/core";
import TopTokens from "./TopTokens";
import { FileCopyOutlined, OpenInNew } from "@material-ui/icons";
import { currentConnection } from "../../../constants";

const useStyles = makeStyles((theme) => ({
  background: {
    padding: 30,
    [theme.breakpoints.down("sm")]: {
      padding: 10,
    },
  },
  breadcrumbs: {
    paddingBottom: 20,
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
      fontSize: 18,
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
  tokenInfo: {
    border: "1px solid #616161",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  openButton: {
    backgroundColor: "#4C2238",
    color: "#f6f6f6",
    borderColor: "#f6f6f6",
    width: 200,
    height: 40,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 10,

    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      padding: "5px 20px 5px 20px",
      width: "100%",
    },
  },
  detailsBox: {
    marginRight: 20,
    [theme.breakpoints.down("sm")]: {
      marginRight: 10,
    },
  },
  detailTitle: {
    fontSize: 14,
    color: "#bdbdbd",
    fontWeight: 500,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 600,
  },
  copyIcon: {
    fontSize: 14,
    cursor: "pointer",
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
  } = useTokenData(address);

  // const allPairs = useTokenPairs(address); // todo: fix api
  const allPairs = useAllPairData(); // testing

  useEffect(() => {
    // console.log("allPairs", allPairs);
    document.querySelector("body").scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs);

  // all transactions with this token
  const transactions = useTokenTransactions(address);

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : "";
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : "";

  // volume
  const volume = formattedNum(
    !!oneDayVolumeUSD ? oneDayVolumeUSD : oneDayVolumeUT,
    true
  );

  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT;
  const volumeChange = formattedPercent(
    !usingUtVolume ? volumeChangeUSD : volumeChangeUT
  );

  // liquidity
  const liquidity = formattedNum(totalLiquidityUSD, true);
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  const fee = formattedNum(oneDayVolumeUSD * 0.025, true);
  // transactions
  const txnChangeFormatted = formattedPercent(txnChange);

  const classes = useStyles();
  return (
    <div className="container">
      <div className={classes.background}>
        <div for="breadcrumbs" className={classes.breadcrumbs}>
          <h6 className={classes.breadcrumbsTitle}>
            Tokens →{" "}
            <span>
              {symbol}
              <a
                style={{ color: "#DF097C", paddingLeft: 5 }}
                target="_blank"
                href={`https://rinkeby.etherscan.io/address/${id}`}
              >
                ({id && id.slice(0, 8)})
              </a>
            </span>
          </h6>
        </div>
        <div for="token-details" className={classes.tokenDetails}>
          <h1 className={classes.tokenTitle}>
            <TokenIcon
              symbol={symbol}
              address={id}
              className={classes.tokenImage}
            />
            <span style={{ paddingRight: 3 }}>{name}</span>
            <span style={{ paddingRight: 15 }}>({symbol})</span>
            <span>${formatCurrency(priceUSD)}</span>
            <span className={classes.changeIndicator}>
              ${formatCurrency(priceUSD)}
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
                    {formatCurrency(totalLiquidityUSD)}
                  </h6>
                  <p className={classes.cardChangeIndicator}>
                    {liquidityChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Volume (24Hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{volume}</h6>
                  <p className={classes.cardChangeIndicator}>
                    {volumeChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Fees (24hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{fee}</h6>
                  <p className={classes.cardChangeIndicator}>
                    {volumeChangeUSD}%
                  </p>
                </div>
              </Card>
            </div>
            <div className="col-md-8">
              <Card elevation={10} className={classes.chartsCard}>
                {/* <div> */}
                <TokenChart
                  address={address}
                  color={"#E0077D"}
                  base={priceUSD}
                />
                {/* </div> */}
              </Card>
            </div>
          </div>
        </div>
        <div for="transaction-table" className="mt-5">
          <h6 className={classes.sectionTitle}>Top Pairs</h6>
          <div>
            <div className={classes.tokenList}>
              <TopTokens
                tableType="TopPools"
                allPairs={!allPairs ? {} : allPairs}
              />
            </div>
          </div>
        </div>
        <div for="token-information" className="mt-5">
          <h6 className={classes.sectionTitle}>Token Information </h6>
          <div>
            <div className={classes.tokenList}>
              <Card elevetation={10} className={classes.tokenInfo}>
                <div className="d-flex justify-content-start align-items-center">
                  <div className={classes.detailsBox}>
                    <h5 className={classes.detailTitle}>Symbol</h5>
                    <h6 className={classes.detailValue}>{symbol}</h6>
                  </div>
                  <div className={classes.detailsBox}>
                    <h5 className={classes.detailTitle}>Name</h5>
                    <h6 className={classes.detailValue}>{name}</h6>
                  </div>
                  <div className={classes.detailsBox}>
                    <h5 className={classes.detailTitle}>Address</h5>
                    <h6 className={classes.detailValue}>
                      {!id ? "" : id}{" "}
                      <span>
                        <FileCopyOutlined
                          className={classes.copyIcon}
                          onClick={() =>
                            navigator.clipboard.writeText(!id ? "" : id)
                          }
                        />
                      </span>
                    </h6>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <a
                    href={
                      currentConnection === "testnet"
                        ? `https://rinkeby.etherscan.io/address/${id}`
                        : `https://etherscan.io/address/${id}`
                    }
                    target="_blank"
                  >
                    <Button className={classes.openButton}>
                      View On Explorer <OpenInNew />
                    </Button>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TokenPage;
