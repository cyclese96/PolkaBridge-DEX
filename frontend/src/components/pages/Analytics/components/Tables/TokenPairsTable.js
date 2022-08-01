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
import TokenIcon from "../../../../common/TokenIcon";
import { Link } from "react-router-dom";
import { ArrowDownward } from "@material-ui/icons";
import { formattedNum } from "../../../../../utils/timeUtils";

const useStyles = makeStyles((theme) => ({
  table: {
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
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
  tokenImageWrapper: {
    marginLeft: 10,
    marginRight: 10,
  },
  tokenImage: {
    height: 20,
    borderRadius: "50%",
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

export default function TokenPairsTable({ data }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [sortedFees, setSortedFees] = useState(false);
  const [sortedVolume7d, setSortedVolume7d] = useState(false);
  const [skipIndex, setSkipIndex] = useState(0);

  let styles = {
    tableHeading: {
      fontSize: window.innerWidth < 500 ? 11 : 14,
      color: "black",
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  useEffect(() => {
    let result = Object.keys(data).filter((key) => {
      console.log("pair page", key);
      if (parseFloat(data[key]?.reserveUSD) > 0) {
        return true;
      }
    });
    result = Object.keys(data).map((key) => data[key]);
    if (result.length > 0) {
      setRows(result);
      // console.log(result);
    }
  }, [data]);

  const sortByFees = () => {
    let tempRows = [...rows];
    if (sortedFees) {
      tempRows.sort((a, b) => a.oneDayVolumeUSD - b.oneDayVolumeUSD);
    } else {
      tempRows.sort((a, b) => b.oneDayVolumeUSD - a.oneDayVolumeUSD);
    }
    setSortedFees(!sortedFees);
    setRows([...tempRows]);
  };
  const sortByVolume7D = () => {
    let tempRows = [...rows];
    if (sortedVolume7d) {
      tempRows.sort((a, b) => a.oneWeekVolumeUSD - b.oneWeekVolumeUSD);
    } else {
      tempRows.sort((a, b) => b.oneWeekVolumeUSD - a.oneWeekVolumeUSD);
    }
    setSortedVolume7d(!sortedVolume7d);
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
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
            backgroundColor: "white",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow style={{ color: "black" }}>
              <TableCell style={styles.tableHeading}>Name</TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                TVL
              </TableCell>

              <TableCell
                align="right"
                style={styles.tableHeading}
                onClick={sortByFees}
              >
                Volume(24hrs){" "}
                <span>
                  {sortedFees ? (
                    <ArrowUpward className={classes.arrowIcon} />
                  ) : (
                    <ArrowDownward className={classes.arrowIcon} />
                  )}
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={styles.tableHeading}
                onClick={sortByVolume7D}
              >
                Volume(7d){" "}
                <span>
                  {sortedVolume7d ? (
                    <ArrowUpward className={classes.arrowIcon} />
                  ) : (
                    <ArrowDownward className={classes.arrowIcon} />
                  )}
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={styles.tableHeading}
                onClick={sortByFees}
              >
                Fees(24hrs){" "}
                <span>
                  {sortedFees ? (
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
              <TableRow className="text-center">
                <Loader />
                <div className="text-center">Fetching informations...</div>
              </TableRow>
            )}
            {data && rows.length === 0 && (
              <TableRow>
                <div className="text-center my-3">No data to display</div>
              </TableRow>
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
                    style={{ color: "#212121", fontSize: 12 }}
                    sortDirection="asc"
                  >
                    <span>
                      {skipIndex * 5 + index + 1}
                      <span className={classes.tokenImageWrapper}>
                        {" "}
                        <TokenIcon
                          symbol={row.token0.symbol}
                          address={row?.token0?.id}
                          className={classes.tokenIcon}
                        />
                        <span style={{ marginLeft: -10 }}>
                          <TokenIcon
                            symbol={row.token1.symbol}
                            address={row?.token1?.id}
                            className={classes.tokenIcon}
                          />
                        </span>
                      </span>
                    </span>
                    <Link to={`/pair/${row.id}`} className={classes.link}>
                      <span className={classes.cellText}>
                        {row.token0.symbol} - {row.token1.symbol}
                      </span>
                      <small className={classes.cellTextSecondary}></small>
                    </Link>
                  </TableCell>

                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    ${formattedNum(parseInt(row.reserveUSD))}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    ${formattedNum(parseFloat(row.oneDayVolumeUSD).toFixed(2))}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    ${formattedNum(parseFloat(row.oneDayVolumeUSD).toFixed(2))}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={classes.tableText}
                    style={{ color: "#212121", fontSize: 12 }}
                  >
                    ${" "}
                    {formattedNum(
                      (parseFloat(row.oneDayVolumeUSD) * 0.02).toFixed(2)
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
