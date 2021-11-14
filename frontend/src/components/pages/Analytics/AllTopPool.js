import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Input, makeStyles } from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { Search } from "@material-ui/icons";
import TokenIcon from "../../common/TokenIcon";

const useStyles = makeStyles((theme) => ({
  table: {
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    color: "white",
    width: "80%",
    height: 1000,
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
  changeIndicator: {
    background: "green",
    color: "white",
    fontSize: 12,
    marginLeft: 10,
    borderRadius: 7,
    padding: "4px 8px 4px 8px",
  },
  tokenListHeading: {
    color: "white",
    fontSize: 25,
    paddingLeft: 20,
  },
  search: {
    position: "relative",
    borderRadius: "1px solid red",
    backgroundColor: "none",
    color: "grey",
    marginRight: 10,
  },
}));

export default function AllTopPool({ data }) {
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

  return (
    <Paper elevation={10} className={classes.table}>
      <div className="d-flex justify-content-between mt-4 mb-4">
        <div className={classes.tokenListHeading}>Top Pool</div>
        <Search className={classes.search}></Search>
      </div>
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
              <TableCell align="right" style={styles.tableHeading}>
                Liquidity
                <span></span>
              </TableCell>

              <TableCell align="right" style={styles.tableHeading}>
                Volume(24hrs) <span></span>
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Price
              </TableCell>
              <TableCell align="right" style={styles.tableHeading}>
                Change(24hrs) <span></span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ color: "white", fontSize: 13 }}
              >
                <span>
                  <span className={classes.tokenImageWrapper}>
                    <TokenIcon className={classes.tokenIcon} />
                    <span style={{ marginLeft: -10 }}>
                      <TokenIcon className={classes.tokenIcon} />
                    </span>
                  </span>
                </span>
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  PolkaBridge
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  ETH-PBR
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$43,637,930
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$4,239
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$6,108
                </span>
              </TableCell>
              <TableCell
                align="right"
                className={classes.tableText}
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span style={{ color: "#ef5350" }}>-4.32%</span>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ color: "white", fontSize: 13 }}
              >
                <span>
                  <span className={classes.tokenImageWrapper}>
                    <TokenIcon className={classes.tokenIcon} />
                    <span style={{ marginLeft: -10 }}>
                      <TokenIcon className={classes.tokenIcon} />
                    </span>
                  </span>
                </span>
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  PolkaBridge
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  ETH-PBR
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$43,637,930
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$4,239
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$6,108
                </span>
              </TableCell>
              <TableCell
                align="right"
                className={classes.tableText}
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span style={{ color: "#ef5350" }}>-4.32%</span>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ color: "white", fontSize: 13 }}
              >
                <span>
                  <span className={classes.tokenImageWrapper}>
                    <TokenIcon className={classes.tokenIcon} />
                    <span style={{ marginLeft: -10 }}>
                      <TokenIcon className={classes.tokenIcon} />
                    </span>
                  </span>
                </span>
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  PolkaBridge
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  ETH-PBR
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$43,637,930
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$4,239
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$6,108
                </span>
              </TableCell>
              <TableCell
                align="right"
                className={classes.tableText}
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span style={{ color: "#ef5350" }}>-4.32%</span>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ color: "white", fontSize: 13 }}
              >
                <span>
                  <span className={classes.tokenImageWrapper}>
                    <TokenIcon className={classes.tokenIcon} />
                    <span style={{ marginLeft: -10 }}>
                      <TokenIcon className={classes.tokenIcon} />
                    </span>
                  </span>
                </span>
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  PolkaBridge
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  ETH-PBR
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$43,637,930
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$4,239
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$6,108
                </span>
              </TableCell>
              <TableCell
                align="right"
                className={classes.tableText}
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span style={{ color: "#ef5350" }}>-4.32%</span>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ color: "white", fontSize: 13 }}
              >
                <span>
                  <span className={classes.tokenImageWrapper}>
                    <TokenIcon className={classes.tokenIcon} />
                    <span style={{ marginLeft: -10 }}>
                      <TokenIcon className={classes.tokenIcon} />
                    </span>
                  </span>
                </span>
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  PolkaBridge
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  ETH-PBR
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$43,637,930
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$4,239
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$6,108
                </span>
              </TableCell>
              <TableCell
                align="right"
                className={classes.tableText}
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span style={{ color: "#ef5350" }}>-4.32%</span>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ color: "white", fontSize: 13 }}
              >
                <span>
                  <span className={classes.tokenImageWrapper}>
                    <TokenIcon className={classes.tokenIcon} />
                    <span style={{ marginLeft: -10 }}>
                      <TokenIcon className={classes.tokenIcon} />
                    </span>
                  </span>
                </span>
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  PolkaBridge
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  ETH-PBR
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$43,637,930
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$4,239
                </span>
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span className={classes.cellText} style={{ fontSize: 13 }}>
                  US$6,108
                </span>
              </TableCell>
              <TableCell
                align="right"
                className={classes.tableText}
                style={{ color: "#e5e5e5", fontSize: 13 }}
              >
                <span style={{ color: "#ef5350" }}>-4.32%</span>
              </TableCell>
            </TableRow>
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
