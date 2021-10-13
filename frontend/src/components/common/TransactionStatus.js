import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#121827",
    color: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 320,
    height: 350,
    padding: 20,
    [theme.breakpoints.down("sm")]: {
      width: 240,
      height: "100%",
      paddingBottom: 15,
    },
  },
  message: {
    color: "#f9f9f9",
    fontSize: 22,
  },
  closeIcon: {
    color: "white",
    fontSize: 22,
    textAlign: "right",
    width: 50,
  },
  image: {
    height: 60,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    width: "90%",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 14,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    padding: "8px 50px 8px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      width: "80%",
    },
  },
}));

const TransactionStatus = ({ caseValue = 1 }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.background}>
        <div className="d-flex justify-content-end" style={{ width: "100%" }}>
          <Close fontSize="default" className={classes.closeIcon} />
        </div>
        <div className="mt-4 mb-2">
          {caseValue === 0 && (
            <img src="/img/submit.png" className={classes.image} />
          )}
          {caseValue === 1 && (
            <img src="/img/fail.png" className={classes.image} />
          )}
          {caseValue === 2 && (
            <img src="/img/success.png" className={classes.image} />
          )}
        </div>
        {caseValue === 0 && (
          <h6 className={classes.message}>Transaction Submitted</h6>
        )}
        {caseValue === 1 && (
          <h6 className={classes.message}>Transaction Failed</h6>
        )}
        {caseValue === 2 && (
          <h6 className={classes.message}>Transaction Succeed</h6>
        )}

        <h6 style={{ paddingTop: 2, color: "#DF097C", fontSize: 15 }}>
          View on explorer
        </h6>
        <Button variant="contained" className={classes.closeButton}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default TransactionStatus;
