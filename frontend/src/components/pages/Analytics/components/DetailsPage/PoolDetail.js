import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  usePairData,
  usePairTransactions,
} from "../../../../../contexts/PairData";
import { formattedNum } from "../../../../../utils/timeUtils";
// import { useEthPrice } from "../../../../../contexts/GlobalData";
import { Button, Card } from "@material-ui/core";
import TokenIcon from "../../../../common/TokenIcon";
// import { formatCurrency } from "../../../utils/helper";
// import TokenChart from "../../components/Charts/TokenChart";
// import { formatCurrency } from "../../../../../utils/formatters";
// import { currentConnection } from "../../../../../constants/index";
import { FileCopyOutlined, OpenInNew } from "@material-ui/icons";
import PairTransactionsTable from "../Tables/PairTransactionsTable";
import Loader from "../../../../common/Loader";
import PairChart from "../Charts/PairChart";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { urls } from "utils/formatters";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  background: {
    padding: 30,
    [theme.breakpoints.down("sm")]: {
      padding: 10,
    },
  },
  breadcrumbs: {
    paddingBottom: 10,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 10,
    },
  },
  breadcrumbsTitle: {
    color: theme.palette.textColors.heading,

    fontSize: 14,
    fontWeight: 400,
  },
  tokenDetails: {
    paddingTop: 20,
    paddingBottom: 16,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 5,
    },
  },
  ratioCard: {
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,

    borderRadius: 15,

    padding: "5px 10px 5px 10px",
    marginRight: 10,
    color: "black",
  },
  tokenTitle: {
    color: theme.palette.textColors.heading,

    fontSize: "2rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: 17,
    },
  },
  tokenImage: {
    height: 30,
    marginRight: 10,
  },
  tokenImage2: {
    height: 30,
    marginRight: 10,
    marginLeft: -20,
    zIndex: -100,
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
    color: "black",
    paddingTop: 5,
    paddingBottom: 10,
  },
  liquidityCard: {
    height: 120,
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
    color: theme.palette.textColors.heading,

    fontSize: 14,
    textAlign: "left",
    paddingBottom: 7,
  },
  cardValue: {
    color: theme.palette.textColors.heading,

    fontSize: 30,
    textAlign: "left",
    [theme.breakpoints.down("sm")]: {
      fontSize: 28,
    },
  },
  cardTokenValue: {
    color: theme.palette.textColors.subheading,

    fontSize: 20,
    textAlign: "left",
  },
  tokenAvatarPooled: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  cardChangeIndicator: {
    color: "green",
    fontSize: 18,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
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
    backgroundColor: "white",
    color: "black",
  },
  tokenInfo: {
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: "white",
    color: "black",
    borderRadius: 15,
    paddingTop: 15,
    paddingBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    },
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
    marginRight: 30,
    [theme.breakpoints.down("sm")]: {
      marginRight: 10,
    },
  },
  detailTitle: {
    fontSize: 14,
    color: "#212121",
    fontWeight: 500,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0.5,
    color: "#000000",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  copyIcon: {
    fontSize: 14,
    cursor: "pointer",
  },
  loader: {
  
    minHeight: `calc(100vh - 120px)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function PoolDetail({ pairAddress }) {
  const [poolInfo, setPoolInfo] = useState(null);
  const [pairTransactions, setPairTransactions] = useState(null);

  const {
    token0,
    token1,
    reserve0,
    reserve1,
    // reserveUSD,
    // trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    // oneDayVolumeUntracked,
    // volumeChangeUntracked,
    liquidityChangeUSD,
  } = usePairData(pairAddress);

  const transactions = usePairTransactions(pairAddress); // todo fix api for pair transactions
  // const transactions = useGlobalTransactions();
  const poolData = usePairData(pairAddress);
  const selectedChain = useSelector(state => state.account?.currentChain);

  useEffect(() => {
    if (Object.keys(poolData).length !== 0 || !poolData) {
      setPoolInfo(poolData);
    }
  }, [poolData]);

  useEffect(() => {
    if (transactions !== null && transactions !== undefined) {
      let result = Object.keys(transactions).map((key) => transactions[key]);
      if (result.length > 0) {
        setPairTransactions(transactions);
        // console.log(transactions);
      }
    }
  }, [transactions]);

  useEffect(() => {
    document.querySelector("body").scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  // const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked;

  // const volume = formattedNum(
  //   !oneDayVolumeUSD ? oneDayVolumeUSD : usingUtVolume
  // );
  // Total gas fees collected
  const fees = formattedNum(oneDayVolumeUSD * 0.002);

  const isLoaded = () => {
    return (poolInfo && poolInfo.token1?.symbol) || (token0 && token0.address);
  };

  // token data for usd
  // const [ethPrice] = useEthPrice();

  const classes = useStyles();
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
                Pair
              </Link>
              →{" "}
              <span>
                {poolInfo.token0?.symbol} - {poolInfo.token1?.symbol}
                <a
                  style={{ color: "#DF097C", paddingLeft: 5 }}
                  target="_blank"
                  rel="noreferrer"
                  href={urls.showAddress(pairAddress)}
                >
                  ({pairAddress && pairAddress.slice(0, 8)})
                </a>
              </span>
            </h6>
          </div>
          <div for="token-details" className={classes.tokenDetails}>
            <h1 className={classes.tokenTitle}>
              <TokenIcon
                symbol={poolInfo.token0?.symbol}
                address={poolInfo.token0?.id}
                className={classes.tokenImage}
              />
              <TokenIcon
                symbol={poolInfo.token1?.symbol}
                address={poolInfo.token1?.id}
                className={classes.tokenImage2}
              />
              <span style={{ paddingRight: 3 }}>
                {poolInfo.token0?.symbol}- {poolInfo.token1?.symbol}
              </span>

              <span style={{ paddingLeft: 5 }}>Pair</span>
            </h1>
          </div>
          <div
            for="tokenRatioCards"
            className="d-flex justify-content-start mb-4"
          >
            <div className={classes.ratioCard}>
              {" "}
              <Link to={`/token/${token0?.id}`} style={{ color: "black" }}>
                <TokenIcon
                  symbol={poolInfo.token0?.symbol}
                  address={poolInfo.token0?.id}
                  className={classes.tokenImage}
                  size={20}
                />{" "}
                {poolInfo.token0?.symbol} ={" "}
                {parseFloat(poolInfo.token0Price).toFixed(6)}{" "}
                {poolInfo.token1?.symbol}
              </Link>
            </div>
            <div className={classes.ratioCard}>
              <Link to={`/token/${token1?.id}`} style={{ color: "black" }}>
                <TokenIcon
                  symbol={poolInfo.token1?.symbol}
                  address={poolInfo.token1?.id}
                  className={classes.tokenImage}
                  size={20}
                />{" "}
                {poolInfo.token1?.symbol} ={" "}
                {parseFloat(poolInfo.token1Price).toFixed(6)}{" "}
                {poolInfo.token0?.symbol}
              </Link>
            </div>
          </div>{" "}
          <div for="token-stats">
            <h6 className={classes.sectionTitle}>Pair Stats</h6>
            <div className="row">
              <div className="col-md-4">
                <Card elevation={10} className={classes.liquidityCard}>
                  <h6 className={classes.cardTitle}>Total Liquidity</h6>
                  <div className="d-flex justify-content-between">
                    <h6 className={classes.cardValue}>
                      ${formattedNum(poolInfo.trackedReserveUSD)}
                    </h6>
                    <p className={classes.cardChangeIndicator}>
                      {liquidityChangeUSD < 0 ? (
                        <span style={{ color: "red" }}>
                          {" "}
                          {parseFloat(liquidityChangeUSD).toFixed(2)}%
                        </span>
                      ) : (
                        <span>
                          {parseFloat(liquidityChangeUSD).toFixed(2)}%
                        </span>
                      )}
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
                      {volumeChangeUSD < 0 ? (
                        <span style={{ color: "red" }}>
                          {" "}
                          {parseFloat(volumeChangeUSD).toFixed(2)}%
                        </span>
                      ) : (
                        <span>{parseFloat(volumeChangeUSD).toFixed(2)}%</span>
                      )}
                    </p>
                  </div>
                </Card>
                <Card elevation={10} className={classes.liquidityCard}>
                  <h6 className={classes.cardTitle}>Fees (24hrs)</h6>
                  <div className="d-flex justify-content-between">
                    <h6 className={classes.cardValue}>${fees}</h6>
                    <p className={classes.cardChangeIndicator}>
                      {volumeChangeUSD < 0 ? (
                        <span style={{ color: "red" }}>
                          {" "}
                          {parseFloat(volumeChangeUSD).toFixed(2)}%
                        </span>
                      ) : (
                        <span>{parseFloat(volumeChangeUSD).toFixed(2)}%</span>
                      )}
                    </p>
                  </div>
                </Card>
                <Card elevation={10} className={classes.liquidityCard}>
                  <h6 className={classes.cardTitle}>Pooled tokens</h6>
                  <div className="d-flex justify-content-start">
                    <TokenIcon
                      address={poolInfo.token0?.id}
                      symbol={token0?.symbol}
                      className={classes.tokenAvatarPooled}
                    />
                    <h6 className={classes.cardTokenValue}>
                      <CurrencyFormat
                        value={poolInfo.reserve0}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={1}
                        fixedDecimalScale={0}
                      />{" "}
                      {poolInfo.token0?.symbol}
                    </h6>
                  </div>
                  <div className="d-flex justify-content-start">
                    <TokenIcon
                      address={poolInfo.token1?.id}
                      symbol={token1?.symbol}
                      className={classes.tokenAvatarPooled}
                    />
                    <h6 className={classes.cardTokenValue}>
                      <CurrencyFormat
                        value={poolInfo.reserve1}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={1}
                        fixedDecimalScale={0}
                      />{" "}
                      {poolInfo.token1?.symbol}
                    </h6>
                  </div>
                </Card>
              </div>
              <div className="col-md-8">
                <Card elevation={10} className={classes.chartsCard}>
                  <PairChart
                    address={pairAddress}
                    color={"#E0077D"}
                    base0={reserve1 / reserve0}
                    base1={reserve0 / reserve1}
                  />
                </Card>
              </div>
            </div>
          </div>
          <div for="transaction-table" className="mt-5">
            <h6 className={classes.sectionTitle}>Pair Transactions</h6>
            <div className="d-flex justify-content-center p-2">
              <PairTransactionsTable data={pairTransactions} />
            </div>
          </div>
          <div for="token-information" className="mt-5">
            <h6 className={classes.sectionTitle}>Pair Information </h6>
            <div>
              <div className={classes.tokenList}>
                <Card elevetation={10} className={classes.tokenInfo}>
                  <div className="d-flex justify-content-start align-items-center">
                    <div className={classes.detailsBox}>
                      <h5 className={classes.detailTitle}>Pair Name</h5>
                      <h6 className={classes.detailValue}>
                        {token0?.symbol}-{token1?.symbol}
                      </h6>
                    </div>

                    <div className={classes.detailsBox}>
                      <h5 className={classes.detailTitle}>Pair Address</h5>
                      <h6 className={classes.detailValue}>
                        {pairAddress?.slice(0, 7)}
                        <span>
                          <FileCopyOutlined
                            className={classes.copyIcon}
                            onClick={() =>
                              navigator.clipboard.writeText(pairAddress)
                            }
                          />
                        </span>
                      </h6>
                    </div>

                    <div className={classes.detailsBox}>
                      <h5 className={classes.detailTitle}>
                        {token0?.symbol} Address
                      </h5>
                      <h6 className={classes.detailValue}>
                        {token0?.id?.slice(0, 8)}{" "}
                        <span>
                          <FileCopyOutlined
                            className={classes.copyIcon}
                            onClick={() =>
                              navigator.clipboard.writeText(token0?.id)
                            }
                          />
                        </span>
                      </h6>
                    </div>

                    <div className={classes.detailsBox}>
                      <h5 className={classes.detailTitle}>
                        {token1?.symbol} Address
                      </h5>
                      <h6 className={classes.detailValue}>
                        {token1?.id?.slice(0, 8)}{" "}
                        <span>
                          <FileCopyOutlined
                            className={classes.copyIcon}
                            onClick={() =>
                              navigator.clipboard.writeText(token1?.id)
                            }
                          />
                        </span>
                      </h6>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <a
                      href={urls.showAddress(pairAddress, selectedChain)}
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
export default PoolDetail;
