import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, makeStyles } from "@material-ui/core";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Loader from "../../../../common/Loader";
import { formatTime } from "../../../../../utils/timeUtils";
import BigNumber from "bignumber.js";
import { formattedNum, urls } from "../../../../../utils/formatters";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  table: {
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: "white",
    color: "black",
    width: "100%",
    marginBottom: 10,
    [theme.breakpoints.down("sm")]: {
      width: "96vw",
    },
  },
  arrowIcon: {
    color: "white",
    fontSize: 15,
    marginTop: -2,
  },
  tokenImage: {
    height: 20,
    borderRadius: "50%",
    marginLeft: 10,
    marginRight: 10,
  },
  link: {
    color: "#F4599C",
    "&:hover": {
      color: "#165BBD",
    },
  },
  pagination: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTop: "1px solid #e5e5e5",
  },
  paginationButton: {
    color: "#DF097C",
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 13,
  },
}));

export default function PairTransactionsTable({ data }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [skipIndex, setSkipIndex] = useState(0);
  const [sortedTime, setSortedTime] = useState(true);
  const [txFilterType, setTxFilterType] = useState("all");
  const [tokenHeaderNames, setTokenHeaderNames] = useState({
    token0: "Token(In)",
    token1: "Token(Out)",
  });

  const selectedChain = useSelector(state => state.account?.currentChain);

  let styles = {
    tableHeading: {
      fontSize: window.innerWidth < 500 ? 11 : 14,
      color: "black",
      fontWeight: 700,
    },
  };
  useEffect(() => {
    if (data) {
      let result = Object.keys(data).map((key) => data[key]);
      if (result.length > 0) {
        let tempRows = [...result[0], ...result[1], ...result[2]];
        tempRows.sort(
          (a, b) => b.transaction.timestamp - a.transaction.timestamp
        );
        setRows([...tempRows]);
        // console.log(result);
      }
    }
  }, [data]);

  const sortByTime = () => {
    let tempRows = [...rows];
    if (sortedTime) {
      tempRows.sort(
        (a, b) => a.transaction.timestamp - b.transaction.timestamp
      );
    } else {
      tempRows.sort(
        (a, b) => b.transaction.timestamp - a.transaction.timestamp
      );
    }
    setSortedTime(!sortedTime);
    setRows([...tempRows]);
  };
  const filterTx = (filter) => {
    if (!data) {
      return;
    }

    let result = Object.keys(data).map((key) => data[key]);
    let tempRows;
    if (filter === "all") {
      tempRows = [...result[0], ...result[1], ...result[2]];
      tempRows.sort(
        (a, b) => b.transaction.timestamp - a.transaction.timestamp
      );
    }
    if (filter === "swap") {
      tempRows = [...result[2]];
      tempRows.sort(
        (a, b) => b.transaction.timestamp - a.transaction.timestamp
      );
    }
    if (filter === "add") {
      tempRows = [...result[0]];
      tempRows.sort(
        (a, b) => b.transaction.timestamp - a.transaction.timestamp
      );
    }
    if (filter === "remove") {
      tempRows = [...result[1]];
      tempRows.sort(
        (a, b) => b.transaction.timestamp - a.transaction.timestamp
      );
    }
    setRows([...tempRows]);
    setTxFilterType(filter);
  };

  const getToken = (_row) => {
    if (
      new BigNumber(_row?.amount0In).gt(0) &&
      new BigNumber(_row?.amount1Out).gt(0)
    ) {
      return {
        fromSymbol: _row?.pair?.token0.symbol,
        toSymbol: _row?.pair?.token1?.symbol,
        tokenIn: _row?.amount0In,
        tokenOut: _row?.amount1Out,
      };
    } else {
      return {
        fromSymbol: _row?.pair?.token1.symbol,
        toSymbol: _row?.pair?.token0?.symbol,
        tokenIn: _row?.amount1In,
        tokenOut: _row?.amount0Out,
      };
    }
  };

  return (
    <Paper className={classes.table}>
      <TableContainer
        elevation={10}
        style={{
          borderRadius: 4,
          boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
          backgroundColor: "white",
          color: "black",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
            backgroundColor: "white",
            color: "black",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow style={{ color: "black" }}>
              <TableCell style={styles.tableHeading}>
                {" "}
                <div className="d-flex justify-content-start">
                  <button
                    type="button"
                    onClick={() => {
                      filterTx("all");
                      setTokenHeaderNames({
                        token0: "Token(In)",
                        token1: "Token(Out)",
                      });
                    }}
                    style={{
                      color: txFilterType === "all" ? "black" : "grey",
                      textTransform: "none",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                      width: 35,
                      fontWeight: 500,
                      outline: "none",
                      border: "none",
                    }}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      filterTx("swap");
                      setTokenHeaderNames({
                        token0: "Token(In)",
                        token1: "Token(Out)",
                      });
                    }}
                    style={{
                      color: txFilterType === "swap" ? "black" : "grey",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                      width: 60,
                      fontWeight: 500,
                      border: "none",
                      outline: "none",
                      textTransform: "none",
                    }}
                  >
                    Swaps
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      filterTx("add");
                      setTokenHeaderNames({
                        token0: "Token Amount",
                        token1: "Token Amount",
                      });
                    }}
                    style={{
                      color: txFilterType === "add" ? "black" : "grey",

                      textTransform: "none",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                      outline: "none",
                      width: 50,
                      fontWeight: 500,
                      border: "none",
                    }}
                  >
                    Adds
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      filterTx("remove");
                      setTokenHeaderNames({
                        token0: "Token Amount",
                        token1: "Token Amount",
                      });
                    }}
                    style={{
                      color: txFilterType === "remove" ? "black" : "grey",
                      outline: "none",
                      textTransform: "none",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                      width: 60,
                      border: "none",
                      fontWeight: 500,
                    }}
                  >
                    Removes
                  </button>
                </div>
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Total value
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                {tokenHeaderNames.token0}
              </TableCell>

              <TableCell align="right" style={styles.tableHeading}>
                {tokenHeaderNames.token1}
              </TableCell>
              {/* <TableCell align="right" style={styles.tableHeading}>
                Account
              </TableCell> */}
              <TableCell
                align="right"
                style={styles.tableHeading}
                onClick={sortByTime}
              >
                <span style={{ cursor: "pointer" }}>
                  {" "}
                  Time <ArrowUpward className={classes.arrowIcon} />
                </span>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!data && (
              <div>
                <Loader />
              </div>
            )}
            {data &&
              rows.slice(skipIndex * 5, skipIndex * 5 + 5).map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ color: "black", fontSize: 12 }}
                  >
                    <span style={{ marginRight: 10 }}>
                      {skipIndex * 5 + index + 1}
                    </span>
                    <a
                      href={urls.showTransaction(row.transaction.id,selectedChain)}
                      target="_blank"
                      rel="noreferrer"
                      className={classes.link}
                    >
                      {" "}
                      <span
                        style={{
                          backgroundColor: "#f9f9f9",
                          padding: "5px 5px 5px 5px",
                          borderRadius: 7,
                          fontWeight: 500,
                        }}
                      >
                        {" "}
                        {row.__typename.toLowerCase() === "mint" &&
                          `ADD  ${getToken(row).fromSymbol} and ${
                            getToken(row).toSymbol
                          } `}
                        {row.__typename.toLowerCase() === "burn" &&
                          `REMOVE ${getToken(row).fromSymbol} and ${
                            getToken(row).toSymbol
                          }`}
                        {row.__typename.toLowerCase() === "swap" &&
                          `SWAP ${getToken(row).fromSymbol} for ${
                            getToken(row).toSymbol
                          }`}
                      </span>{" "}
                      {/* {" " + row.pair.token0.symbol} -{row.pair.token1.symbol} */}
                    </a>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    ${parseFloat(row.amountUSD).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    {["mint", "burn"].includes(row.__typename.toLowerCase())
                      ? formattedNum(row?.amount0)
                      : formattedNum(getToken(row).tokenIn)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    {["mint", "burn"].includes(row.__typename.toLowerCase())
                      ? formattedNum(row?.amount1)
                      : formattedNum(getToken(row).tokenOut)}
                  </TableCell>
                  {/* <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 12 }}
                  >

                    {row.sender?.slice(0, 3)} {"..."}
                    {row.sender?.slice(0, 3)}
                  </TableCell> */}
                  <TableCell
                    align="right"
                    className={classes.tableText}
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    {formatTime(row.transaction.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className={classes.pagination}>
          <Button
            className={classes.paginationButton}
            disabled={skipIndex === 0}
            onClick={() => setSkipIndex(skipIndex - 1)}
          >
            {"<< "}Prev
          </Button>
          <Button
            className={classes.paginationButton}
            disabled={skipIndex === parseInt(rows.length / 5)}
            onClick={() => setSkipIndex(skipIndex + 1)}
          >
            Next{" >>"}
          </Button>
        </div>
      </TableContainer>
    </Paper>
  );
}
