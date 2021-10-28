import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { useEffect } from "react/cjs/react.development";

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
    fontWeight: 600,
  },
  copyIcon: {
    fontSize: 14,
    cursor: "pointer",
  },
}));

function PoolDetail({ pairAddress }) {
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

  // const transactions = usePairTransactions(pairAddress);// todo fix api for pair transactions
  const transactions = useGlobalTransactions();

  useEffect(() => {
    console.log("alltransaction", transactions);
  }, [transactions]);

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

  const formattedLiquidity = reserveUSD
    ? formattedNum(reserveUSD, true)
    : formattedNum(trackedReserveUSD, true);
  const usingUntrackedLiquidity = !trackedReserveUSD && !!reserveUSD;
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // volume
  const volume = !!oneDayVolumeUSD
    ? formattedNum(oneDayVolumeUSD, true)
    : formattedNum(oneDayVolumeUntracked, true);
  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked;
  const volumeChange = formattedPercent(
    !usingUtVolume ? volumeChangeUSD : volumeChangeUntracked
  );

  const showUSDWaning = usingUntrackedLiquidity | usingUtVolume;

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : "-";

  // token data for usd
  const [ethPrice] = useEthPrice();
  const token0USD =
    token0?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true)
      : "";

  const token1USD =
    token1?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true)
      : "";

  // rates
  const token0Rate =
    reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : "-";
  const token1Rate =
    reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : "-";

  // formatted symbols for overflow
  const formattedSymbol0 =
    token0?.symbol.length > 6
      ? token0?.symbol.slice(0, 5) + "..."
      : token0?.symbol;
  const formattedSymbol1 =
    token1?.symbol.length > 6
      ? token1?.symbol.slice(0, 5) + "..."
      : token1?.symbol;

  const classes = useStyles();
  return (
    <div className="container">
      <div className={classes.background}>
        <div for="breadcrumbs" className={classes.breadcrumbs}>
          <h6 className={classes.breadcrumbsTitle}>
            Pair →{" "}
            <span>
              {token0?.symbol} - {token1?.symbol}
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
              symbol={token0?.symbol}
              address={token0?.address}
              className={classes.tokenImage}
            />
            <TokenIcon
              symbol={token1?.symbol}
              address={token1?.address}
              className={classes.tokenImage2}
            />
            <span style={{ paddingRight: 3 }}>
              {token0?.symbol} - {token1?.symbol}
            </span>
            {/* <span style={{ paddingRight: 15 }}>({symbol})</span> */}
            <span>${formatCurrency(token1USD)}</span>
            <span className={classes.changeIndicator}>
              ${formatCurrency(token1Rate)}
            </span>
          </h1>
        </div>
        <div
          for="tokenRatioCards"
          className="d-flex justify-content-start mb-4"
        >
          <div className={classes.ratioCard}>
            {" "}
            <TokenIcon
              symbol={token0?.symbol}
              address={token0?.address}
              className={classes.tokenImage}
              size={20}
            />{" "}
            {token0?.symbol} = 3,849 {token1?.symbol} (US$3,849)
          </div>
          <div className={classes.ratioCard}>
            {" "}
            <TokenIcon
              symbol={token1?.symbol}
              address={token1?.address}
              className={classes.tokenImage}
              size={20}
            />{" "}
            {token1?.symbol} = 3,849 {token0?.symbol} (US$3,849)
          </div>
        </div>{" "}
        <div for="token-stats">
          <h6 className={classes.sectionTitle}>Token Statistics</h6>
          <div className="row">
            <div className="col-md-4">
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Total Liquidity</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>
                    {formatCurrency(trackedReserveUSD)}
                  </h6>
                  <p className={classes.cardChangeIndicator}>
                    {liquidityChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Volume (24Hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{oneDayVolumeUSD}</h6>
                  <p className={classes.cardChangeIndicator}>
                    {volumeChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Fees (24hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{fees}</h6>
                  <p className={classes.cardChangeIndicator}>
                    {volumeChangeUSD}%
                  </p>
                </div>
              </Card>
            </div>
            <div className="col-md-8">
              <Card elevation={10} className={classes.chartsCard}>
                <div>
                  <TokenChart
                    address={pairAddress}
                    color={"#E0077D"}
                    base={0}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div for="transaction-table" className="mt-5">
          <h6 className={classes.sectionTitle}>Transactions</h6>
          <div>
            <div className={classes.tokenList}>
              {/* <TopTokens
                tableType="Transactions"
                allTransactions={!transactions ? {} : transactions}
              /> */}
              <PairTransactionsTable
                tableType="Transactions"
                allTransactions={!transactions ? {} : transactions}
              />
            </div>
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
                      {pairAddress?.slice(0, 8)}
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
export default PoolDetail;
