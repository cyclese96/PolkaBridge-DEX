import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

import { AccountBalanceWallet, Close } from "@material-ui/icons";
import { etheriumNetwork } from "../../constants/index";
import { fromWei } from "../../utils/helper";
import { connect } from "react-redux";
import { formatCurrency } from "../../utils/formatters";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.bgCard,
    color: theme.palette.textColors.heading,

    width: 320,
    height: 350,
    padding: 10,
    [theme.breakpoints.down("md")]: {
      width: 280,
      height: "100%",
    },
  },
  heading: {
    fontSize: 18,
    fontWeight: 400,
    color: theme.palette.textColors.heading,
  },
  subheading: {
    fontSize: 19,
    fontWeight: 500,
    color: theme.palette.textColors.subheading,

    [theme.breakpoints.down("md")]: {
      fontSize: 19,
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
  },
  numbers: {
    color: theme.palette.textColors.pbr,

    fontSize: 20,
    marginLeft: 15,
  },
  icon: {
    marginRight: 5,
    color: "#757575",
  },
  cancelButton: {
    backgroundColor: theme.palette.primary.iconBack,
    color: theme.palette.primary.iconColor,
    borderColor: "#f6f6f6",
    width: 130,
    height: 40,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      padding: "5px 20px 5px 20px",
      width: "fit-content",
    },
  },
  signoutButton: {
    backgroundColor: theme.palette.primary.pbr,
    color: theme.palette.primary.buttonText,
    borderColor: "#f6f6f6",
    width: 130,
    height: 40,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      padding: "5px 20px 5px 20px",
      width: "fit-content",
    },
  },
  accountCard: {
    marginTop: 20,
    width: "100%",
    height: "100%",
    minHeight: 100,
    maxHeight: 150,
    backgroundColor: theme.palette.primary.bgCard,
    border: "0.5px solid rgba(224, 224, 224,0.6)",
    padding: 15,
    borderRadius: 15,
    paddingBottom: 0,
    marginBottom: 30,
    [theme.breakpoints.down("sm")]: {
      padding: 15,
      width: "95%",
      height: "100%",
    },
  },
}));

const AccountDialog = ({
  open,
  handleClose,
  handleLogout,
  account: { currentAccount, balance, currentNetwork },
}) => {
  const classes = useStyles();
  const onSingOut = () => {
    localStorage.setItem(`logout${currentAccount}`, currentAccount);
    handleLogout();
    handleClose();
  };

  const getCoins = () => {
    if (currentNetwork === etheriumNetwork) {
      return [
        { coin: "ETH", balance: formatCurrency(fromWei(balance["ETH"])) },
      ];
    } else {
      return [
        { coin: "BNB", balance: formatCurrency(fromWei(balance["BNB"])) },
      ];
    }
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
          style: {
            borderRadius: 15,
            backgroundColor: "#121827",
            color: "#f9f9f9",
          },
        }}
      >
        <div className={classes.background}>
          <div className="d-flex justify-content-between w-100 px-3 mt-3">
            <div>
              <h6 className={classes.heading}>Account</h6>
            </div>
            <div style={{ cursor: "pointer" }}>
              <Close onClick={() => handleClose()} />
            </div>
          </div>
          <div className={classes.accountCard}>
            <h6 style={{ fontWeight: 600, fontSize: 14, color: "#757575" }}>
              Wallet connected with:
            </h6>
            <p className={classes.subheading}>
              {currentAccount ? <span></span> : "..."}
              {[...currentAccount?.toString()]?.splice(0, 6)}
              {"..."}
              {[...currentAccount?.toString()]?.splice(
                [...currentAccount?.toString()]?.length - 6,
                6
              )}
            </p>
            <h6
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: "#757575",
                marginTop: 20,
              }}
            >
              Balance:
            </h6>
            {getCoins().map((item) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  paddingBottom: 10,
                }}
              >
                <>
                  <AccountBalanceWallet
                    fontSize="small"
                    className={classes.icon}
                  />
                  <span className={classes.icon}>{item.coin}</span>
                  <span className={classes.numbers}>{item.balance}</span>
                </>
              </div>
            ))}
          </div>

          <div className={classes.buttons}>
            <Button
              variant="light"
              onClick={handleClose}
              className={classes.cancelButton}
            >
              Cancel
            </Button>
            <Button onClick={onSingOut} className={classes.signoutButton}>
              Sign out
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(React.memo(AccountDialog));
