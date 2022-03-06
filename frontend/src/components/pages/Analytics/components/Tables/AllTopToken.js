import React from "react";
import { makeStyles } from "@material-ui/core";
import { useAllTokenData } from "../../../../../contexts/TokenData";
import TopTokensTable from "./TopTokensTable";

const useStyles = makeStyles((theme) => ({
  background: {
    width: "100%",
    paddingLeft: 70,
    paddingRight: 70,
    [theme.breakpoints.down("sm")]: {
      width: "100%",

      paddingLeft: 5,
      paddingRight: 5,
    },
  },
  table: {
    color: "white",
    width: "100%",
    marginTop: 30,
    paddingLeft: 100,
    paddingRight: 100,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      maxWidth: 50,
      paddingLeft: 5,
      paddingRight: 5,
    },
  },
  tableWrapper: {
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
  },
  tokenListHeading: {
    color: "white",
    marginTop: 20,
    marginBottom: 10,

    fontWeight: 500,
    letterSpacing: 0.7,
    fontSize: 18,
  },
}));

export default function AllTopTokensTable() {
  const classes = useStyles();

  const allTokens = useAllTokenData();

  return (
    <div className="container">
      <div className={classes.background}>
        <div className="d-flex justify-content-start">
          <div className={classes.tokenListHeading}>Top Tokens</div>
        </div>
        <div className="d-flex justify-content-center">
          <TopTokensTable data={allTokens} numberOfRows={10} />
        </div>
      </div>
    </div>
  );
}
