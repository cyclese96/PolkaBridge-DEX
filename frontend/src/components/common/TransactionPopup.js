import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { urls } from "../../utils/formatters";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { TransactionStatus } from "../../constants/index";
import { CircularProgress } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.bgCard,
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
    color: theme.palette.textColors.heading,
    fontSize: 16,
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
  heading: {
    fontSize: 18,
    fontWeight: 400,

    color: theme.palette.textColors.heading,
  },
}));

const TransactionPopup = ({ dex: { transaction }, onClose }) => {
  const classes = useStyles();
  const { chainId } = useActiveWeb3React();

  return (
    <div>
      <div className={classes.background}>
        <h6 className={classes.heading}>Transaction Status</h6>{" "}
        <div className="mt-4 ">
          {transaction.status === TransactionStatus.WAITING && (
            <div className="text-center">
              <CircularProgress
                style={{ color: "#E0077D" }}
                color="secondary"
                size={60}
              />

              <div className="text-center  mt-5 mb-4 ">
                <div className={classes.heading}>Waiting for confirmaton</div>
                <div className="mt-2"></div>

                <div className="mt-5 mb-2">
                  <span className={classes.message}>
                    Please confirm transaction in your wallet{" "}
                  </span>
                </div>
              </div>
            </div>
          )}
          {transaction.status === TransactionStatus.PENDING && (
            <div className="text-center">
              <img
                src="/img/submit.png"
                alt="Submitted"
                className={classes.image}
              />
              <h6 className={classes.message}>Transaction Submitted</h6>
              <a
                href={urls.showTransaction(transaction.hash, chainId)}
                target="_blank"
                rel="noreferrer"
              >
                <h6 style={{ color: "#DF097C", fontSize: 14 }}>
                  View on explorer
                </h6>
              </a>
            </div>
          )}
          {transaction.status === TransactionStatus.COMPLETED && (
            <div className="text-center">
              <img
                src="/img/success.png"
                alt="success"
                className={classes.image}
              />{" "}
              <h6 className={classes.message}>Transaction Succeed</h6>
              <a
                href={urls.showTransaction(transaction.hash, chainId)}
                target="_blank"
                rel="noreferrer"
              >
                <h6 style={{ color: "#DF097C", fontSize: 14 }}>
                  View on explorer
                </h6>
              </a>
            </div>
          )}

          {transaction.status === TransactionStatus.FAILED &&
            transaction?.hash && (
              <div className="text-center">
                <img
                  src="/img/fail.png"
                  alt="failed"
                  className={classes.image}
                />
                <h6 className={classes.message}>Transaction Failed</h6>
                <a
                  href={urls.showTransaction(transaction.hash, chainId)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h6 style={{ color: "#DF097C", fontSize: 14 }}>
                    View on explorer
                  </h6>
                </a>
              </div>
            )}

          {transaction.status === TransactionStatus.FAILED &&
            !transaction?.hash && (
              <div className="text-center">
                <img
                  src="/img/fail.png"
                  alt="Submitted"
                  className={classes.image}
                />
                <h6 className={classes.message}> Cancelled</h6>
              </div>
            )}
        </div>
        {transaction.status !== TransactionStatus.WAITING && (
          <Button className={classes.closeButton} onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dex: state.dex,
});

export default connect(mapStateToProps, {})(React.memo(TransactionPopup));
