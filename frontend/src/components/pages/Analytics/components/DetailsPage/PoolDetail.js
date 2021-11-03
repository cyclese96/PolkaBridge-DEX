import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";


import {
  usePairData,
  usePairTransactions,
} from "../../../../../contexts/PairData";
import { formattedNum, formattedPercent } from "../../../../../utils/timeUtils";
import {
  useEthPrice,
  useGlobalTransactions,
} from "../../../../../contexts/GlobalData";
import { Button, Card } from "@material-ui/core";
import TokenIcon from "../../../../common/TokenIcon";
// import { formatCurrency } from "../../../utils/helper";
import TokenChart from "../../components/Charts/TokenChart";
import { formatCurrency } from "../../../../../utils/formatters";
import { currentConnection } from "../../../../../constants";
import { FileCopy, FileCopyOutlined, OpenInNew } from "@material-ui/icons";
import PairTransactionsTable from "../Tables/PairTransactionsTable";
import Loader from "../../../../common/Loader";
import PairChart from "../Charts/PairChart";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";

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
    color: "white",
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
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,

    border: "0.5px solid #616161",
    borderRadius: 15,
    color: "white",
    padding: "5px 10px 5px 10px",
    marginRight: 10,
  },
  tokenTitle: {
    color: "white",
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
    fontSize: 25,
    textAlign: "left",
  },
  cardTokenValue: {
    color: "white",
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
    fontSize: 13,
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

    color: "#bdbdbd",
    fontWeight: 500,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0.5,
    color: "#f7f7f7",
  },
  copyIcon: {
    fontSize: 14,
    cursor: "pointer",
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
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
  } = usePairData(pairAddress);

  const transactions = usePairTransactions(pairAddress); // todo fix api for pair transactions
  // const transactions = useGlobalTransactions();
  const poolData = usePairData(pairAddress);

  useEffect(() => {
    console.log("alltransaction", transactions);
  }, []);

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
        console.log(transactions);
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

  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked;

  // Total gas fees collected
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.002, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : "-";

  const isLoaded = () => {
    return (poolInfo && poolInfo.token1?.symbol) || (token0 && token0.address)
  }

  // token data for usd
  const [ethPrice] = useEthPrice();

  const classes = useStyles();
  return (
    <div className="container">
      {!isLoaded() && (
        <div className="text-center mt-4">
          <Loader />
          <h6>Fetching data...</h6>
        </div>
      )}
      {isLoaded() && (
        <div className={classes.background}>
          <div for="breadcrumbs" className={classes.breadcrumbs}>
            <h6 className={classes.breadcrumbsTitle}>
              <Link to="/charts">Pair</Link>→{" "}
              <span>
                {poolInfo.token0?.symbol} - {poolInfo.token1?.symbol}
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
                symbol={poolInfo.token0?.symbol}
                address={poolInfo.token0?.address}
                className={classes.tokenImage}
              />
              <TokenIcon
                symbol={poolInfo.token1?.symbol}
                address={poolInfo.token1?.address}
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
              <Link to={`/token/${token0?.id}`}>
                <TokenIcon
                  symbol={token0?.symbol}
                  address={token0?.address}
                  className={classes.tokenImage}
                  size={20}
                />{" "}
                {poolInfo.token0?.symbol} ={" "}
                {parseFloat(poolInfo.token0Price).toFixed(6)}{" "}
                {poolInfo.token1?.symbol}
              </Link>
            </div>
            <div className={classes.ratioCard}>
              <Link to={`/token/${token1?.id}`}>
                <TokenIcon
                  symbol={token1?.symbol}
                  address={token1?.address}
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
                      {parseFloat(poolInfo.trackedReserveUSD).toFixed(2)}
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
                      {parseFloat(oneDayVolumeUSD).toFixed(2)}
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
                    <h6 className={classes.cardValue}>{fees}</h6>
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
                      address={poolInfo.token0?.address}
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
                      address={poolInfo.token1?.address}
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
                  {/* <div
                    style={{
                      marginTop: 140,
                      color: "#DF097C",
                      textAlign: "center",
                    }}
                  >
                    Insufficient data to display chart.
                  </div> */}
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
                      href={
                        currentConnection === "testnet"
                          ? `https://rinkeby.etherscan.io/address/${pairAddress}`
                          : `https://etherscan.io/address/${pairAddress}`
                      }
                      target="_blank"
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
