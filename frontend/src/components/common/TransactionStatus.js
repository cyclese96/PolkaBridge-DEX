import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { currentConnection } from "../../constants";

const useStyles = makeStyles((theme) => ({
  background: {
    color: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    minWidth: 300,
    width: "100%",
    height: 350,
    padding: 20,
    [theme.breakpoints.down("sm")]: {
      width: 240,
      height: "100%",
      paddingBottom: 15,
    },
  },
  message: {
    marginTop: 15,
    color: "#f9f9f9",
    fontSize: 16,
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 10,
    color: "white",
    fontSize: 20,
    textAlign: "right",
    width: 50,
  },
  image: {
    height: 90,
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

const TransactionStatus = ({ caseType = "pending", onClose, txHash }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.background}>
        <h6 style={{ fontSize: 18 }}>Transaction Status</h6>{" "}
        <div className="mt-4 ">
          {caseType === "pending" && (
            <div className="text-center">
              <img src="/img/submit.png" className={classes.image} />
              <h6 className={classes.message}>Transaction Submitted</h6>
            </div>
          )}
          {caseType === "failed" && (
            <div>
              <img src="/img/fail.png" className={classes.image} />
              <h6 className={classes.message}>Transaction Failed</h6>
            </div>
          )}
          {caseType === "success" && (
            <div className="text-center">
              <img src="/img/success.png" className={classes.image} />{" "}
              <h6 className={classes.message}>Transaction Succeed</h6>
            </div>
          )}
          <div className="text-center">
            <a
              href={
                currentConnection === "testnet"
                  ? `https://rinkeby.etherscan.io/tx/${txHash}`
                  : `https://etherscan.io/tx/${txHash}`
              }
              target="_blank"
            >
              <h6 style={{ color: "#DF097C", fontSize: 14 }}>
                View on explorer
              </h6>
            </a>
          </div>
        </div>
        {caseType !== "success" && (
          <Button
            variant="contained"
            className={classes.closeButton}
            onClick={onClose}
          >
            Close
          </Button>
        )}
        {caseType === "success" && (
          <Button
            variant="contained"
            className={classes.closeButton}
            onClick={() => window.location.reload()}
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionStatus;
