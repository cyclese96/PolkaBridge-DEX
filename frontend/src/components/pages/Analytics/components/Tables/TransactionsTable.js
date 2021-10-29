import React, { useEffect } from "react";
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
import { useState } from "react/cjs/react.development";
import { formatTime } from "../../../../../utils/timeUtils";
import { currentConnection } from "../../../../../constants";

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
    color: "#DF097C",
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 13,
  },
}));

export default function TransactionsTable({ data }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [skipIndex, setSkipIndex] = useState(0);
  const [sortedTime, setSortedTime] = useState(true);

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
        console.log(result);
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
              <TableCell style={styles.tableHeading}>Transaction</TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Total value
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Token Amount
              </TableCell>

              <TableCell align="right" style={styles.tableHeading}>
                Token Amount
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
                        {" "}
                        {row.__typename.toUpperCase()}
                      </span>{" "}
                      {" " + row.pair.token0.symbol} -{row.pair.token1.symbol}
                    </a>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    {parseFloat(row.amountUSD).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    {row.amount0
                      ? parseFloat(row.amount0).toFixed(3)
                      : row.amount0Out !== "0"
                      ? parseFloat(row.amount0Out).toFixed(3)
                      : parseFloat(row.amount0In).toFixed(3)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    {row.amount1
                      ? parseFloat(row.amount1).toFixed(3)
                      : row.amount1Out !== "0"
                      ? parseFloat(row.amount1Out).toFixed(3)
                      : parseFloat(row.amount1In).toFixed(3)}
                    {}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    {[...row.sender].splice(0, 3)} {"..."}
                    {[...row.sender].splice([...row.sender].length - 5, 5)}
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
