import * as React from "react";
import { Button, Card, Divider, makeStyles } from "@material-ui/core";
import cancel from "../../../assets/close.png";
import { Link } from "react-router-dom";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    height: 270,
    borderRadius: 15,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      // width: "90%",
      // maxWidth: 400,
      width: 300,
      border: "1px solid #212121",
    },
  },
  tokenTitle: {
    fontWeight: 500,
    fontSize: 16,
    paddingBottom: 3,
    color: "#e5e5e5",
  },

  maxButton: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    textTransform: "none",
    fontSize: 14,
    padding: "2px 10px 2px 10px",
    marginBottom: 4,
    marginRight: 4,
    borderRadius: 15,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      width: "80%",
    },
  },
  header: {
    color: "white",
    fontSize: 22,
    fontWeight: 600,
  },
  imgCancel: {
    height: 20,
    width: 20,
  },
  section: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
  },
  inputSection: {
    padding: 7,
    height: 100,
    width: 400,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    marginTop: 20,
    borderRadius: 15,
    background: `#29323c`,
    // boxShadow: "inset -6px -6px 10px 0 rgba(0, 0, 0, 0.5)",
  },
  confirmButton: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    textTransform: "none",
    fontSize: 17,
    width: 185,
    borderRadius: 15,
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

export default function SimpleDialog() {
  const classes = useStyles();

  return (
    <Card elevation={10} className={classes.card}>
      <div className={classes.cardContents}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className={classes.header}>Stake LP token</h1>
          </div>
          <div>
            <div>
              <img className={classes.imgCancel} src={cancel} />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Divider style={{ backgroundColor: "grey", height: 1 }} />
        </div>
        <div className={classes.inputSection}>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              <h1 className={classes.section}>Stake</h1>
            </div>
            <div>
              <h1 className={classes.section}>Balance: 13.8973</h1>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              <div className={classes.tokenTitle}>0.00</div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Button className={classes.maxButton} disabled={true}>
                Max
              </Button>
              <h1 className={classes.section}>PBR-USDT LP</h1>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around align-items-center mt-2">
          <Button
            variant="contained"
            className={classes.confirmButton}
            disabled={true}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className={classes.confirmButton}
            // disabled={true}
          >
            Confirm
          </Button>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <Link to="liquidity">
            {" "}
            <div className={classes.tokenTitle}>
              Get PBR-USDT LP <OpenInNewIcon fontSize="small" />{" "}
            </div>{" "}
          </Link>
          <div className={classes.tokenAmount}></div>
        </div>
      </div>
    </Card>
  );
}
