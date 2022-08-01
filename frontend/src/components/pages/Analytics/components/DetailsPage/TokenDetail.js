import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  // useTokenChartData,
  useTokenData,
  // useTokenPairs,
  // useTokenPriceData,
  // useTokenTransactions,
} from "../../../../../contexts/TokenData";
// import { usePrevious } from "react-use";
import {
  useAllPairData,
  // useDataForList,
} from "../../../../../contexts/PairData";
import {
  formatCurrency,
  formattedNum,
  urls,
} from "../../../../../utils/formatters";
import TokenIcon from "../../../../common/TokenIcon";
import { Link } from "react-router-dom";
import TokenChart from "../../components/Charts/TokenChart";
import { Button, Card } from "@material-ui/core";
import { FileCopyOutlined, OpenInNew } from "@material-ui/icons";
import Loader from "../../../../common/Loader";
import TokenTxTable from "../Tables/TokenTxTable";
import { useGlobalTransactions } from "../../../../../contexts/GlobalData";
import TokenPairsTable from "../Tables/TokenPairsTable";
import { useSelector } from "react-redux";

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
    color: theme.palette.textColors.heading,
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
    color: theme.palette.textColors.heading,

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
    [theme.breakpoints.down("sm")]: {
      padding: "3px 3px 3px 3px",
      fontSize: 10,
    },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 500,
    paddingLeft: 10,
    color: theme.palette.textColors.subheading,

    paddingTop: 5,
    paddingBottom: 10,
  },
  liquidityCard: {
    height: 130,
    width: "100%",
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 10,

    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
  },
  cardTitle: {
    color: "black",
    fontSize: 14,
    textAlign: "left",
    paddingBottom: 7,
  },
  cardValue: {
    color: "#212121",
    fontSize: 30,
    textAlign: "left",
  },
  cardChangeIndicator: {
    color: "green",
    fontSize: 18,
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

    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
  },
  tokenInfo: {
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
    borderRadius: 15,
    paddingTop: 15,
    paddingBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  openButton: {
    backgroundColor: "#F9057D",
    color: "#f6f6f6",
    borderColor: "#f6f6f6",
    width: 200,
    height: 40,
    textTransform: "none",
    fontSize: 15,
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
    color: "#212121",
    fontWeight: 500,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 600,
    color: "black",
  },
  copyIcon: {
    fontSize: 14,
    cursor: "pointer",
  },
  wrapper: {
    position: "relative",
    // background: "#000524",
    // border: "1px solid #000",
    // boxShadow: ` 0 22px 35px -16px rgba(0, 0, 0, 0.71)`,
    maxWidth: "850px",
    margin: "0 auto",
  },
  loader: {
    minHeight: `calc(100vh - 120px)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    // oneDayVolumeUT,
    liquidityChangeUSD,
    priceChangeUSD,
  } = useTokenData(address);

  const [rows, setRows] = useState([]);
  const [tokenPairRows, setTokenPairRows] = useState([]);

  const selectedChain = useSelector((state) => state.account?.currentChain);

  useEffect(() => {
    document.querySelector("body").scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  // volume
  // const volume = formattedNum(oneDayVolumeUSD);

  // const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT;

  const fee = formattedNum(oneDayVolumeUSD * 0.005);

  const allPairs = useAllPairData();

  useEffect(() => {
    if (!allPairs || allPairs.length === 0) {
      return;
    }
    let pairObjects = {};
    let tokenPairs = Object.keys(allPairs).filter(
      (key) =>
        allPairs[key].token0.id === address ||
        allPairs[key].token1.id === address
    );

    tokenPairs = tokenPairs.filter(
      (key) => parseInt(allPairs[key]?.reserveUSD) > 0
    );

    tokenPairs.map((key) => (pairObjects[key] = allPairs[key]));
    setTokenPairRows(pairObjects);
  }, [allPairs, address]);
  // all transactions with this token
  const allTransactions = useGlobalTransactions();

  useEffect(() => {
    if (!allTransactions || !address) {
      return;
    }

    function loadtokenTransactions() {
      let _burns = allTransactions ? allTransactions.burns : [];
      let _swaps = allTransactions ? allTransactions.swaps : [];
      let _mints = allTransactions ? allTransactions.mints : [];

      _burns = _burns.filter(
        (item) =>
          item.pair.token0.id === address || item.pair.token1.id === address
      );
      _swaps = _swaps.filter(
        (item) =>
          item.pair.token0.id === address || item.pair.token1.id === address
      );
      _mints = _mints.filter(
        (item) =>
          item.pair.token0.id === address || item.pair.token1.id === address
      );

      setRows({ mints: _mints, swaps: _swaps, burns: _burns });
    }

    loadtokenTransactions();
  }, [allTransactions, address, setRows]);

  const classes = useStyles();

  const isLoaded = () => {
    return name || symbol || priceUSD || oneDayVolumeUSD || totalLiquidityUSD;
  };

  return (
    <div className="container">
      {!isLoaded() && (
        <div className={classes.loader}>
          <Loader />
        </div>
      )}
      {isLoaded() && (
        <div className={classes.background}>
          <div for="breadcrumbs" className={classes.breadcrumbs}>
            <h6 className={classes.breadcrumbsTitle}>
              <Link to="/charts" style={{ color: "black" }}>
                Tokens{" "}
              </Link>
              →{" "}
              <span>
                {symbol}
                <a
                  style={{ color: "#DF097C", paddingLeft: 5 }}
                  target="_blank"
                  rel="noreferrer"
                  href={urls.showAddress(id)}
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
              {window.innerWidth < 300 ? (
                ""
              ) : (
                <span style={{ paddingRight: 3 }}>{name}</span>
              )}
              <span style={{ paddingRight: window.innerWidth < 500 ? 2 : 15 }}>
                ({symbol})
              </span>
              <span>${formatCurrency(priceUSD)}</span>
              <span className={classes.changeIndicator}>
                {parseFloat(priceChangeUSD).toFixed(0)} %
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
                      ${formattedNum(totalLiquidityUSD)}
                    </h6>
                    <p className={classes.cardChangeIndicator}>
                      {parseFloat(liquidityChangeUSD).toFixed(2)}%
                    </p>
                  </div>
                </Card>
                <Card elevation={10} className={classes.liquidityCard}>
                  <h6 className={classes.cardTitle}>Volume (24Hrs)</h6>
                  <div className="d-flex justify-content-between">
                    <h6 className={classes.cardValue}>
                      ${formattedNum(oneDayVolumeUSD)}
                    </h6>
                    <p className={classes.cardChangeIndicator}>
                      {parseFloat(volumeChangeUSD).toFixed(2)}%
                    </p>
                  </div>
                </Card>
                <Card elevation={10} className={classes.liquidityCard}>
                  <h6 className={classes.cardTitle}>Fees (24hrs)</h6>
                  <div className="d-flex justify-content-between">
                    <h6 className={classes.cardValue}>${fee}</h6>
                    <p className={classes.cardChangeIndicator}>
                      {parseFloat(volumeChangeUSD).toFixed(2)}%
                    </p>
                  </div>
                </Card>
              </div>
              <div className="col-md-8">
                <Card elevation={10} className={classes.chartsCard}>
                  <TokenChart
                    address={address}
                    color={"#E0077D"}
                    base={priceUSD}
                  />
                </Card>
              </div>
            </div>
          </div>
          <div for="token-pairs-table" className="mt-5">
            <h6 className={classes.sectionTitle}>Token Pairs</h6>
            <div className="d-flex justify-content-center p-2">
              <TokenPairsTable data={tokenPairRows} />
            </div>
          </div>
          <div for="token-tx-table" className="mt-5">
            <h6 className={classes.sectionTitle}>Token Transactions</h6>
            <div className="d-flex justify-content-center p-2">
              <TokenTxTable data={rows} />
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
                        {!id ? "" : [...id].splice(0, 3)}...
                        {!id ? "" : [...id].splice(id.length - 6, 6)}{" "}
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
                      href={urls.showAddress(id, selectedChain)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button className={classes.openButton}>
                        View on explorer{" "}
                        <OpenInNew style={{ fontSize: 20, marginLeft: 5 }} />
                      </Button>
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TokenPage;
