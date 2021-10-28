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
import TokenIcon from "../../../../common/TokenIcon";
import { Link } from "react-router-dom";

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

export default function TopPoolsTable({ data }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
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
      console.log(result);
    }
  }, [data]);

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
                TVL
              </TableCell>

              <TableCell align="right" style={styles.tableHeading}>
                Volume(24hrs) <ArrowUpward className={classes.arrowIcon} />
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Volume(7d) <ArrowUpward className={classes.arrowIcon} />
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Fees(24hrs)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data && (
              <div className="text-center">
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
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    <span>
                      {skipIndex * 5 + index + 1}
                      <span className={classes.tokenImageWrapper}>
                        {" "}
                        <TokenIcon
                          symbol={row.token0.symbol}
                          className={classes.tokenIcon}
                        />
                        <span style={{ marginLeft: -10 }}>
                          <TokenIcon
                            symbol={row.token1.symbol}
                            className={classes.tokenIcon}
                          />
                        </span>
                      </span>
                    </span>
                    <Link to={`pair/${row.id}`} className={classes.link}>
                      <span className={classes.cellText}>
                        {row.token0.symbol} - {row.token1.symbol}
                      </span>
                      <small className={classes.cellTextSecondary}></small>
                    </Link>
                  </TableCell>

                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    ${parseInt(row.reserveUSD)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    ${parseFloat(row.oneDayVolumeUSD).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    $ {parseInt(row.oneWeekVolumeUSD)}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={classes.tableText}
                    style={{ color: "#e5e5e5", fontSize: 12 }}
                  >
                    ${(parseFloat(row.oneDayVolumeUSD) * 0.02).toFixed(2)}
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
