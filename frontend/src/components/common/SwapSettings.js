import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CustomButton from "../Buttons/CustomButton";
import { connect } from "react-redux";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CustomToolTip from "./CustomToolTip";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#121827",
    color: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 320,
    height: 350,
    [theme.breakpoints.down("sm")]: {
      width: 320,
      height: 350,
    },
  },
  heading: {
    fontSize: 18,
    fontWeight: 400,
    color: "#919191",
  },
  subheading: {
    fontSize: 12,
    fontWeight: 400,
    color: "#919191",
  },
  maxBtn: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    height: 50,
    borderRadius: 10,
    marginLeft: 20,
    color: "#f9f9f9",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
  },
  buttons: {
    // marginTop: 80,
    // marginBottom: 20,
    marginTop: 30,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 20,
    marginLeft: 15,
  },
  icon: {
    marginRight: 5,
    color: "#919191",
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 5,
    height: 30,
    width: "auto",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    fontSize: 18,
    width: 150,
    color: "white",
  },
  settingRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    width: "85%",
    marginTop: 20,
  },
  settingRowLabel: {
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
    color: "#919191",
    marginBottom: 10,
  },
  slippageItem: {
    color: "#E0077D",
    cursor: "pointer",
    border: "0.1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 7,
    marginLeft: 2,
    marginRight: 5,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
}));

const SwapSettings = ({
  open,
  handleClose,
  account: { currentAccount, balance, connected, currentNetwork },
}) => {
  const classes = useStyles();
  const onApply = () => {
    //todo update settings state
    handleClose();
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        disableBackdropClick
        className={classes.dialog}
        color="transparent"
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <div className={classes.background}>
          <DialogTitle onClose={() => handleClose()}>
            <span className={classes.heading}>Settings</span>
          </DialogTitle>
          <div className={classes.settingRow}>
            <span className={classes.settingRowLabel}>
              Slippage tolerance
              <CustomToolTip title="Your transaction will revert if the price changes unfavorably by more than this percentage.">
                <ErrorOutlineIcon style={{ marginLeft: 10 }} />
              </CustomToolTip>
            </span>
            <div>
              <a className={classes.slippageItem}>0.5%</a>
              <a className={classes.slippageItem}>1%</a>
              <input type="text" className={classes.input} placeholder="0.0" />
            </div>
          </div>
          <div className={classes.settingRow}>
            <span className={classes.settingRowLabel}>
              Transaction deadline
              <CustomToolTip
                title="Your transaction will revert if it is pending for more
                      than this long."
              >
                <ErrorOutlineIcon style={{ marginLeft: 10 }} />
              </CustomToolTip>
            </span>
            <div>
              <input type="text" className={classes.input} placeholder="20" />
              <span style={{ fontSize: 12, marginLeft: 10, color: "#919191" }}>
                Minutes
              </span>
            </div>
          </div>
          <div className={classes.buttons}>
            <CustomButton variant="light" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton onClick={onApply}>
              <p>Apply</p>
            </CustomButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(SwapSettings);
