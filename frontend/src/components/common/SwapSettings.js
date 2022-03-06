import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import store from "../../store";
import { UPDATE_SETTINGS } from "../../actions/types";
import {
  defaultSlippage,
  defaultTransactionDeadline,
} from "../../constants/index";
import { Close, InfoRounded } from "@material-ui/icons";
import { Button, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#ffffff",
    color: theme.palette.primary.iconColor,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,

    width: 315,
    height: "100%",
    minHeight: 320,
    [theme.breakpoints.down("sm")]: {
      width: 240,
      height: "100%",
      paddingBottom: 15,
    },
  },
  input: {
    backgroundColor: "transparent",
    color: theme.palette.primary.iconColor,
    height: 40,
    border: "1px solid rgba(224, 224, 224,1)",
    borderRadius: 10,
    // outline: "none",
    padding: 10,
    fontSize: 18,
    width: 150,

    [theme.breakpoints.down("sm")]: {
      width: 80,
      padding: 7,
      fontSize: 15,
      height: "100%",
    },
  },
  closeIcon: {
    color: theme.palette.primary.iconColor,
    fontSize: 24,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
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
    color: theme.palette.primary.iconColor,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 400,
  },
  slippageItem: {
    color: theme.palette.primary.iconColor,
    cursor: "pointer",
    border: "1px solid rgba(224, 224, 224,1)",
    background: theme.palette.primary.iconBack,

    borderRadius: 10,
    padding: 10,
    marginLeft: 2,
    marginRight: 5,

    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      padding: 5,
    },
  },
  cardHeading: {
    paddingTop: 15,
    width: "85%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: theme.palette.primary.pbr,

    color: theme.palette.primary.buttonText,
    width: "84%",
    textTransform: "none",
    fontSize: 17,
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
  heading: {
    color: theme.palette.primary.iconColor,
    paddingTop: 10,
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

  const handleSlippage = useCallback((value) => {
    setSlippage(value);
  }, []);

  useEffect(() => {
    function loadSettings() {
      const _slippage = localStorage.getItem(
        `${currentAccount}_${currentNetwork}_slippage`
      );
      const _deadline = localStorage.getItem(
        `${currentAccount}_${currentNetwork}_deadline`
      );

      if (!_slippage && !_deadline) {
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
    }
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
          style: { borderRadius: 20, backgroundColor: "#121827" },
        }}
      >
        <div className={classes.background}>
          <div className={classes.cardHeading}>
            <h6 className={classes.heading}>Settings</h6>
            <IconButton
              onClick={() => handleClose()}
              style={{ margin: 0, padding: 0 }}
            >
              <Close fontSize="default" className={classes.closeIcon} />
            </IconButton>
          </div>

          <div className={classes.settingRow}>
            <span className={classes.settingRowLabel}>
              Slippage tolerance
              <Tooltip
                arrow
                title={
                  <span style={{ fontSize: 12 }}>
                    Your transaction will revert if the price changes
                    unfavorably by more than this percentage.
                  </span>
                }
              >
                <InfoRounded
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    marginTop: 3,
                    color: "#919191",
                  }}
                />
              </Tooltip>
            </span>
            <div>
              <span
                className={classes.slippageItem}
                onClick={() => handleSlippage(0.5)}
              >
                0.5%
              </span>
              <span
                className={classes.slippageItem}
                onClick={() => handleSlippage(1)}
              >
                1%
              </span>
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
              <Tooltip
                title={
                  <span style={{ fontSize: 13 }}>
                    Your transaction will revert if it is pending for more than
                    this long.
                  </span>
                }
              >
                <InfoRounded
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    marginTop: 3,
                    color: "#919191",
                  }}
                />
              </Tooltip>
            </span>
            <div>
              <input
                type="text"
                className={classes.input}
                placeholder="20"
                onChange={({ target: { value } }) => handleDeadlingInput(value)}
                value={deadline}
              />
              <span
                style={{
                  fontSize: 12,
                  marginLeft: 10,
                  color: "#454545",
                  fontWeight: 600,
                }}
              >
                Minutes
              </span>
            </div>
          </div>
          <Button onClick={onApply} className={classes.applyButton}>
            Apply
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {})(React.memo(SwapSettings));
