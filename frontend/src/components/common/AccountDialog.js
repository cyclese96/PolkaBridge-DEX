import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CustomButton from "../Buttons/CustomButton";
import { ContactMailOutlined } from "@material-ui/icons";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { etheriumNetwork } from "../../constants";
import { formatCurrency, fromWei } from "../../utils/helper";
import { connect } from "react-redux";
import { logout } from "../../actions/accountActions";

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
    justifyContent: "space-evenly",
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
  inputGroup: {
    marginTop: 40,
  },

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#616161 !important",
  },
  inputText: {
    color: "#f8f8f8",
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
}));

const AccountDialog = ({
  open,
  handleClose,
  logout,
  account: { currentAccount, balance, connected, currentNetwork },
}) => {
  const classes = useStyles();
  const onSingOut = () => {
    localStorage.setItem(`logout${currentAccount}`, currentAccount);
    logout();
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
          style: { borderRadius: 15 },
        }}
      >
        <div className={classes.background}>
          <DialogTitle onClose={() => handleClose()}>
            <span className={classes.heading}>My Wallet</span>
          </DialogTitle>
          <div className={classes.balanceCard}>
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
                  <VisibilityIcon fontSize="small" className={classes.icon} />
                  <span className={classes.icon}>{item.coin}</span>
                  <span className={classes.numbers}>{item.balance}</span>
                </>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <ContactMailOutlined fontSize="small" className={classes.icon} />
              <span className={classes.icon}>Address</span>
            </div>
            <p className={classes.subheading}>{currentAccount}</p>
          </div>
          <div className={classes.buttons}>
            <CustomButton variant="light" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton onClick={onSingOut}>Sign out</CustomButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(AccountDialog);
