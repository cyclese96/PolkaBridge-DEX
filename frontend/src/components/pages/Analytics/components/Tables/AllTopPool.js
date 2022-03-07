import React from "react";
import { makeStyles } from "@material-ui/core";

import { useAllPairData } from "../../../../../contexts/PairData";
import TopPoolsTable from "./TopPoolsTable";

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
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    color: "white",
    width: "80%",
    marginTop: 30,
    minWidth: 1000,
    [theme.breakpoints.down("sm")]: {
      width: "96vw",
    },
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

export default function AllTopPoll() {
  const classes = useStyles();

  const allPairs = useAllPairData();

  return (
    <div className="container">
      <div className={classes.background}>
        <div className="d-flex justify-content-start">
          <div className={classes.tokenListHeading}>Top Pools</div>
        </div>
        <div className="d-flex justify-content-center">
          <TopPoolsTable data={allPairs} numberOfRows={10} />
        </div>
      </div>
    </div>
  );
}
