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
import { Link } from "react-router-dom";
import TokenIcon from "../../../../common/TokenIcon";
import { ArrowDownward } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  table: {
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    color: "white",
    width: "100%",
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

export default function TopTokensTable({ data }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [sortedChange, setSortedChange] = useState(false);
  const [sortedVolume, setSortedVolume] = useState(false);
  const [sortedTvl, setSortedTvl] = useState(false);
  const [skipIndex, setSkipIndex] = useState(0);

  let styles = {
    tableHeading: {
      fontSize: window.innerWidth < 500 ? 11 : 14,
      color: "white",
      fontWeight: 700,
    },
  };

  useEffect(() => {
    let result = Object.keys(data).map((key) => data[key]);
    if (result.length > 0) {
      setRows(result);
    }
  }, [data]);

  const sortByChange = () => {
    let tempRows = [...rows];
    if (sortedChange) {
      tempRows.sort((a, b) => a.priceChangeUSD - b.priceChangeUSD);
    } else {
      tempRows.sort((a, b) => b.priceChangeUSD - a.priceChangeUSD);
    }
    setSortedChange(!sortedChange);
    setRows([...tempRows]);
  };
  const sortByVolume = () => {
    let tempRows = [...rows];
    if (sortedVolume) {
      tempRows.sort((a, b) => a.tradeVolume - b.tradeVolume);
    } else {
      tempRows.sort((a, b) => b.tradeVolume - a.tradeVolume);
    }
    setSortedVolume(!sortedVolume);
    setRows([...tempRows]);
  };
  const sortByTvl = () => {
    let tempRows = [...rows];
    if (sortedTvl) {
      tempRows.sort((a, b) => a.totalLiquidityUSD - b.totalLiquidityUSD);
    } else {
      tempRows.sort((a, b) => b.totalLiquidityUSD - a.totalLiquidityUSD);
    }
    setSortedTvl(!sortedTvl);
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
              <TableCell style={styles.tableHeading}>Name</TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Symbol
              </TableCell>
              <TableCell
                align="right"
                style={styles.tableHeading}
                onClick={sortByTvl}
              >
                TVL
                <span>
                  {sortedTvl ? (
                    <ArrowUpward className={classes.arrowIcon} />
                  ) : (
                    <ArrowDownward className={classes.arrowIcon} />
                  )}
                </span>
              </TableCell>

              <TableCell
                align="right"
                style={styles.tableHeading}
                onClick={sortByVolume}
              >
                Volume(24hrs){" "}
                <span>
                  {sortedVolume ? (
                    <ArrowUpward className={classes.arrowIcon} />
                  ) : (
                    <ArrowDownward className={classes.arrowIcon} />
                  )}
                </span>
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Price
              </TableCell>
              <TableCell
                align="right"
                style={styles.tableHeading}
                onClick={sortByChange}
              >
                Change(24hrs){" "}
                <span>
                  {sortedChange ? (
                    <ArrowUpward className={classes.arrowIcon} />
                  ) : (
                    <ArrowDownward className={classes.arrowIcon} />
                  )}
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
              rows.slice(skipIndex * 5).map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ color: "white", fontSize: 12 }}
                  >
                    <span>
                      {skipIndex * 5 + index + 1}

                      <TokenIcon
                        symbol={row.symbol}
                        className={classes.tokenImage}
                      />
                    </span>
                    <Link to={`token/${row.id}`} className={classes.link}>
                      <span className={classes.cellText}>{row.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    {row.symbol}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    {parseInt(row.totalLiquidityUSD)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    ${parseFloat(row.tradeVolumeUSD).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    ${parseFloat(row.priceUSD).toFixed(3)}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={classes.tableText}
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    {row.priceChangeUSD}
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
            disabled={skipIndex === parseInt(rows.length / 5 - 1)}
            onClick={() => setSkipIndex(skipIndex + 1)}
          >
            Next{" >>"}
          </Button>
        </div>
      </TableContainer>
    </Paper>
  );
}
