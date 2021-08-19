import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CustomButton from "../Buttons/CustomButton";
import { connect } from "react-redux";
import { logout } from "../../actions/accountActions";

import TokenList from "./TokenList";
import corgibImg from "../../assets/corgi.png";
import pwarImg from "../../assets/pwar.png";
import bite from "../../assets/bite.png";
import pbrImg from "../../assets/balance.png";
import etherImg from "../../assets/ether.png";
import bnbImg from "../../assets/binance.png";
import { tokens } from "../../constants";

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
    width: 400,
    height: 600,
    [theme.breakpoints.down("sm")]: {
      width: 320,
      height: 500,
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
  input: {
    backgroundColor: "transparent",
    borderRadius: 5,
    height: 40,
    width: "auto",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    fontSize: 18,
    width: "80%",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      height: 100,
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

// const tokens = [
//   {
//     icon: pbrImg,
//     name: "Polkabridge",
//     symbol: "PBR",
//   },
//   {
//     icon: bite,
//     name: "DragonBite",
//     symbol: "BITE",
//   },
//   {
//     icon: pwarImg,
//     name: "Polkawar",
//     symbol: "PWAR",
//   },
//   {
//     icon: corgibImg,
//     name: "Corgib meme coin",
//     symbol: "CORGIB",
//   },
//   {
//     icon: etherImg,
//     name: "Ethereum",
//     symbol: "ETH",
//   },
//   {
//     icon: bnbImg,
//     name: "Binance",
//     symbol: "BNB",
//   },
//   {
//     icon: "",
//     name: "US tether",
//     symbol: "USDT",
//   },
//   {
//     icon: "",
//     name: "US tether",
//     symbol: "USDT",
//   },
//   {
//     icon: "",
//     name: "US tether",
//     symbol: "USDT",
//   },
//   {
//     icon: "",
//     name: "US tether",
//     symbol: "USDT",
//   },
// ];

const SelectTokenDialog = ({
  open,
  handleClose,
  account: { currentAccount, balance, connected, currentNetwork },
  handleTokenSelected,
  disableToken,
}) => {
  const classes = useStyles();

  const [filteredTokens, setTokens] = useState(tokens);

  const onTokenSelect = (token) => {
    handleTokenSelected(token);
    handleClose();
  };

  const handleTokenFilter = (value) => {
    console.log(value);
    const filtered = tokens.filter(
      (item) =>
        item.symbol.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        item.name.toLowerCase().includes(value.toLocaleLowerCase())
    );
    setTokens(filtered);
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
            <span className={classes.heading}>Select a token</span>
          </DialogTitle>

          <input
            type="text"
            className={classes.input}
            placeholder="Search token"
            onChange={({ target: { value } }) => handleTokenFilter(value)}
          />
          {/* <FixedSizeList> */}
          <TokenList
            handleItemSelected={onTokenSelect}
            tokens={filteredTokens}
            disableToken={disableToken}
          />
          {/* </FixedSizeList> */}
          <div className={classes.buttons}>
            <CustomButton variant="light" onClick={handleClose}>
              Cancel
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

export default connect(mapStateToProps, { logout })(SelectTokenDialog);
