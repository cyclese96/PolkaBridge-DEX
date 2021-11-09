import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";

import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Loader from "../../../../common/Loader";
import {
  formatDollarAmount,
  formattedNum,
  formatTime,
} from "../../../../../utils/timeUtils";
import { currentConnection } from "../../../../../constants";
import CurrencyFormat from "react-currency-format";
const useStyles = makeStyles((theme) => ({
  table: {
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,

    color: "white",
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
    borderTop: "1px solid #616161",
  },
  paginationButton: {
    color: "rgb(223, 9, 124)",
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 13,
  },
  filterButton: {
    color: "grey",
    textTransform: "none",
    width: 10,
  },
  filterButtonActive: {
    color: "#f9f9f9",
    textTransform: "none",
    width: 10,
  },
}));

export default function TransactionsTable({ data }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const [skipIndex, setSkipIndex] = useState(0);
  const [sortedTime, setSortedTime] = useState(true);
  const [txFilterType, setTxFilterType] = useState("all");

  let styles = {
    tableHeading: {
      fontSize: window.innerWidth < 500 ? 11 : 14,
      color: "white",
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

  return (
    <Paper elevation={10} className={classes.table}>
      <TableContainer
        elevation={10}
        style={{
          border: "1px solid #616161",
          borderRadius: 10,
          background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
            color: "white",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow style={{ color: "white" }}>
              <TableCell style={styles.tableHeading}>
                <div className="d-flex justify-content-start">
                  <button
                    type="button"
                    onClick={() => {
                      filterTx("all");
                    }}
                    style={{
                      color: txFilterType === "all" ? "white" : "grey",
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
                    }}
                    style={{
                      color: txFilterType === "swap" ? "white" : "grey",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                      width: 60,
                      fontWeight: 500,
                      border: "none",
                      outline: "none",
                      textTransform: "none",
                      fontSize: window.innerWidth < 500 ? 14 : 13,
                    }}
                  >
                    Swaps
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      filterTx("add");
                    }}
                    style={{
                      color: txFilterType === "add" ? "white" : "grey",

                      textTransform: "none",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                      outline: "none",
                      width: 50,
                      fontWeight: 500,
                      border: "none",
                      fontSize: window.innerWidth < 500 ? 14 : 13,
                    }}
                  >
                    Adds
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      filterTx("remove");
                    }}
                    style={{
                      color: txFilterType === "remove" ? "white" : "grey",
                      outline: "none",
                      textTransform: "none",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                      width: 75,
                      border: "none",
                      fontWeight: 500,
                      fontSize: window.innerWidth < 500 ? 14 : 13,
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
                Token(In)
              </TableCell>

              <TableCell align="right" style={styles.tableHeading}>
                Token(Out)
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Account
              </TableCell>
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
                    style={{ color: "white", fontSize: 12 }}
                  >
                    <span style={{ marginRight: 10 }}>
                      {skipIndex * 5 + index + 1}
                    </span>
                    <a
                      href={
                        currentConnection === "testnet"
                          ? `https://rinkeby.etherscan.io/tx/${row.transaction.id}`
                          : `https://etherscan.io/tx/${row.transaction.id}`
                      }
                      target="_blank"
                      className={classes.link}
                    >
                      {" "}
                      <span
                        style={{
                          backgroundColor: "#3a2b2d",
                          padding: "5px 5px 5px 5px",
                          borderRadius: 7,
                          fontWeight: 500,
                        }}
                      >
                        {row.__typename.toLowerCase() === "mint" && "ADD"}
                        {row.__typename.toLowerCase() === "burn" && "REMOVE"}
                        {row.__typename.toLowerCase() === "swap" && "SWAP"}
                      </span>{" "}
                      {" " + row.pair.token0.symbol} -{row.pair.token1.symbol}
                    </a>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 13 }}
                  >
                    ${formattedNum(parseFloat(row.amountUSD).toFixed(2))}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 13 }}
                  >
                    ${row.amount0
                      ? formattedNum(parseFloat(row.amount0).toFixed(3))
                      : row.amount0Out !== "0"
                        ? formattedNum(parseFloat(row.amount0Out).toFixed(3))
                        : formattedNum(parseFloat(row.amount0In).toFixed(3))}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 13 }}
                  >
                    ${row.amount1
                      ? formattedNum(parseFloat(row.amount1).toFixed(3))
                      : row.amount1Out !== "0"
                        ? formattedNum(parseFloat(row.amount1Out).toFixed(3))
                        : formattedNum(parseFloat(row.amount1In).toFixed(3))}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 13 }}
                  >
                    <a
                      style={{ color: "rgb(223, 9, 124)" }}
                      href={
                        currentConnection === "testnet"
                          ? `https://rinkeby.etherscan.io/address/${row.sender}`
                          : `https://etherscan.io/address/${row.sender}`
                      }
                    >
                      {" "}
                      {[...row.sender].splice(0, 3)} {"..."}
                      {[...row.sender].splice([...row.sender].length - 5, 5)}
                    </a>
                  </TableCell>
                  <TableCell
                    align="right"
                    className={classes.tableText}
                    style={{ color: "#e5e5e5", fontSize: 12 }}
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
