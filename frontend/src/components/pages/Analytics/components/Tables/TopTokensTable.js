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
import { Link } from "react-router-dom";
import TokenIcon from "../../../../common/TokenIcon";
import { ArrowDownward } from "@material-ui/icons";
import { formattedNum } from "../../../../../utils/timeUtils";

const useStyles = makeStyles((theme) => ({
  table: {
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: "white",
    borderRadius: 15,
    color: "black",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "96vw",
    },
  },
  arrowIcon: {
    color: "black",
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
  changeIndicator: {
    background: "green",
    color: "white",
    fontSize: 12,
    marginLeft: 10,
    borderRadius: 7,
    padding: "4px 8px 4px 8px",
  },
}));

export default function TopTokensTable({ data, numberOfRows = 5 }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [sortedChange, setSortedChange] = useState(false);
  const [sortedVolume, setSortedVolume] = useState(false);
  const [sortedTvl, setSortedTvl] = useState(false);
  const [skipIndex, setSkipIndex] = useState(0);

  let styles = {
    tableHeading: {
      fontSize: window.innerWidth < 500 ? 11 : 14,
      color: "black",
      fontWeight: 700,
    },
  };

  useEffect(() => {
    let result = Object.keys(data).filter(
      (key) => data[key].id && parseInt(data[key]?.totalLiquidityUSD) > 0
    );

    result = result.map((key) => data[key]);
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
              rows.slice(skipIndex * numberOfRows).map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ color: "black", fontSize: 14 }}
                  >
                    <span>
                      {skipIndex * numberOfRows + index + 1}

                      <TokenIcon
                        symbol={row?.symbol}
                        address={row?.id}
                        className={classes.tokenImage}
                      />
                    </span>
                    <Link to={`token/${row.id}`} className={classes.link}>
                      <span
                        className={classes.cellText}
                        style={{ fontSize: 13 }}
                      >
                        {row.name}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 13 }}
                  >
                    {row.symbol}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 13 }}
                  >
                    ${formattedNum(parseInt(row.totalLiquidityUSD))}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 13 }}
                  >
                    ${formattedNum(parseFloat(row?.oneDayVolumeUSD).toFixed(3))}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 13 }}
                  >
                    ${formattedNum(parseFloat(row.priceUSD).toFixed(3))}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={classes.tableText}
                    style={{ color: "#212121", fontSize: 13 }}
                  >
                    {parseFloat(row.priceChangeUSD) < 0 ? (
                      <span style={{ color: "#ef5350" }}>
                        {" "}
                        {parseFloat(row.priceChangeUSD).toFixed(2)} %
                      </span>
                    ) : (
                      <span style={{ color: "#9ccc65" }}>
                        {parseFloat(row.priceChangeUSD).toFixed(2)} %
                      </span>
                    )}
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
            disabled={skipIndex === parseInt(rows.length / numberOfRows - 1)}
            onClick={() => setSkipIndex(skipIndex + 1)}
          >
            Next{" >>"}
          </Button>
        </div>
      </TableContainer>
    </Paper>
  );
}
