import React, { useEffect, useState } from "react";
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
import store from "../../store";
import { UPDATE_SETTINGS } from "../../actions/types";
import { defaultSlippage, defaultTransactionDeadline } from "../../constants";

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
  account: { currentAccount, currentNetwork },
  dex: { swapSettings },
}) => {
  const classes = useStyles();
  const [slippage, setSlippage] = useState(swapSettings.slippage);
  const [deadline, setDeadline] = useState(swapSettings.deadline);

  const onApply = () => {
    //cache settings in local storage
    localStorage.setItem(
      `${currentAccount}_${currentNetwork}_slippage`,
      slippage
    );
    localStorage.setItem(
      `${currentAccount}_${currentNetwork}_deadline`,
      deadline
    );

    store.dispatch({
      type: UPDATE_SETTINGS,
      payload: {
        slippage: parseFloat(slippage),
        deadline: parseFloat(deadline),
      },
    });
    handleClose();
  };

  const handleDeadlingInput = (value) => {
    setDeadline(value);
  };

  const handleSlippage = (value) => {
    setSlippage(value);
  };

  const loadSettings = () => {
    const _slippage = localStorage.getItem(
      `${currentAccount}_${currentNetwork}_slippage`
    );
    const _deadline = localStorage.getItem(
      `${currentAccount}_${currentNetwork}_deadline`
    );

    if (!_slippage && !_deadline) {
      console.log("no state update");
      return;
    }
    store.dispatch({
      type: UPDATE_SETTINGS,
      payload: {
        slippage: _slippage ? parseFloat(_slippage) : defaultSlippage,
        deadline: _deadline
          ? parseFloat(_deadline)
          : defaultTransactionDeadline,
      },
    });
    setSlippage(_slippage);
    setDeadline(_deadline);
  };

  useEffect(() => {
    console.log("slippage", slippage);
    console.log("setting", swapSettings);
    loadSettings();
  }, [currentNetwork, currentAccount]);

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
              <a
                className={classes.slippageItem}
                onClick={() => handleSlippage(0.5)}
              >
                0.5%
              </a>
              <a
                className={classes.slippageItem}
                onClick={() => handleSlippage(1)}
              >
                1%
              </a>
              <input
                type="text"
                className={classes.input}
                placeholder="0.0"
                onChange={({ target: { value } }) => handleSlippage(value)}
                value={slippage}
              />
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
              <input
                type="text"
                className={classes.input}
                placeholder="20"
                onChange={({ target: { value } }) => handleDeadlingInput(value)}
                value={deadline}
              />
              <span style={{ fontSize: 12, marginLeft: 10, color: "#919191" }}>
                Minutes
              </span>
            </div>
          </div>
          <div className={classes.buttons}>
            <CustomButton variant="light" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton onClick={onApply}>Apply</CustomButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {})(SwapSettings);
