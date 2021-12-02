import * as React from "react";
import { Button, Card, Dialog, Divider, IconButton, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import CloseIcon from "@material-ui/icons/Close";


const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    // height: 270,
    borderRadius: 15,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "transparent",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      width: "98%",
    },
  },
  tokenTitle: {
    fontWeight: 500,
    fontSize: 16,
    paddingBottom: 3,
    color: "#e5e5e5",
  },

  maxButton: {
    backgroundColor: "rgba(223, 9, 124,0.5)",
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
    color: "#cecece",
    fontSize: 16,
    fontWeight: 600,
  },
  inputSection: {
    padding: 7,
    width: 420,
    borderRadius: 30,
    padding: 20,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    marginTop: 20,
    borderRadius: 15,
    background: `#29323c`,
    [theme.breakpoints.down("xs")]: {
      padding: 15,
      width: "100%",
    },
  },
  confirmButton: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    textTransform: "none",
    fontSize: 17,
    // width: 185,
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
      // width: "80%",
    },
  },
  cancelButton: {
    backgroundColor: "#2C2F35",
    color: "white",
    // width: "100%",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 20,

    padding: "8px 50px 8px 50px",

    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  input: {
    backgroundColor: "transparent",
    height: 50,
    width: "auto",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    borderWidth: "1px",
    fontSize: 18,
    width: 180,
    color: "white",
    outline: "none",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      width: 80,
      padding: 7,
      fontSize: 15,
      marginTop: 10,
      height: 50,
      width: 250,
    },
  },
}));

export default function StakeDialog({
  open,
  handleClose,
}
) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState('');

  const handleMax = () => {

  }

  return (

    <Dialog
      onClose={handleClose}
      open={open}
      disableBackdropClick
      className={classes.dialog}
      color="transparent"
      PaperProps={{
        style: {
          borderRadius: 15, backgroundColor: "#121827",
          color: "#f9f9f9",
        },
      }}
    >
      <div className={classes.card}>
        <div className={classes.cardContents}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className={classes.header}>Stake LP token</h1>
            </div>
            <div>
              <div>
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={handleClose}
                >
                  <CloseIcon style={{ color: 'rgba(224, 7, 125, 0.6)' }} />
                </IconButton>
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
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-2">
              <div>
                {/* <div className={classes.tokenTitle}>0.00</div> */}
                <input
                  type="text"
                  className={classes.input}
                  placeholder="0.00"
                  onChange={({ target: { value } }) => setInputValue(value)}
                  value={inputValue}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <Button className={classes.maxButton} onClick={handleMax} >
                  Max
                </Button>
                <h1 className={classes.section}>PBR-USDT LP</h1>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around align-items-center mt-3">
            <Button
              variant="text"
              className={classes.cancelButton}
              onClick={handleClose}
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
          <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
            <Link to="liquidity">
              {" "}
              <div className={classes.tokenTitle}>
                Get PBR-USDT LP <OpenInNewIcon fontSize="small" />{" "}
              </div>{" "}
            </Link>
            <div className={classes.tokenAmount}></div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
