import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CustomButton from "../Buttons/CustomButton";
import TokenList from "./TokenList";
import { importToken } from "../../actions/dexActions";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";

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
    height: 50,
    width: "auto",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    fontSize: 18,
    width: "90%",
    color: "white",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      height: 50,
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

const SelectTokenDialog = ({
  open,
  handleClose,
  handleTokenSelected,
  disableToken,
  importToken,
  dex: { tokenList, importedToken, dexLoading },
  account: { currentAccount, currentNetwork },
}) => {
  const classes = useStyles();

  const [filteredTokens, setTokens] = useState([]);
  const [showImported, setShowImported] = useState(false);
  const [_importedTokens, setImported] = useState([]);

  const onTokenSelect = (token) => {
    handleTokenSelected(token);
    handleClose();
  };

  useEffect(() => {
    setTokens(tokenList);
  }, [tokenList]);

  useEffect(() => {
    console.log("current imported token ", importedToken);
    if (importedToken.symbol) {
      console.log("applying filter now");
      const filteredList = applyFilter(tokenList, importedToken.symbol);
      console.log("filtered result", filteredList);
      setTokens(filteredList);
    }
  }, [importedToken, tokenList]);

  const applyFilter = (list, value) => {
    // console.log("token list", list);
    // console.log("on alue", value);
    const filtered = list.filter(
      (item) =>
        item.symbol.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        item.name.toLowerCase().includes(value.toLocaleLowerCase()) ||
        (item.address &&
          item.address.toLowerCase().includes(value.toLocaleLowerCase()))
    );
    // setTokens(filtered);
    return filtered;
  };

  const handleTokenFilter = async (value) => {
    const filteredList = applyFilter(tokenList, value);
    setTokens(filteredList);
    if (value.length === 42 && filteredList.length === 0) {
      setShowImported(true);
      await importToken(value, currentAccount, currentNetwork);
    } else {
      setShowImported(false);
    }
  };

  const onClose = () => {
    handleClose();
    setShowImported(false);
  };

  return (
    <div>
      <Dialog
        onClose={onClose}
        open={open}
        // onLoad={() => filterTokens("")}
        disableBackdropClick
        className={classes.dialog}
        color="transparent"
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <div className={classes.background}>
          <DialogTitle onClose={onClose}>
            <span className={classes.heading}>Select a token</span>
          </DialogTitle>

          <input
            type="text"
            className={classes.input}
            placeholder="Search name or paste address"
            onChange={({ target: { value } }) => handleTokenFilter(value)}
          />
          {/* <FixedSizeList> */}
          {dexLoading ? (
            <CircularProgress />
          ) : (
            <TokenList
              handleItemSelected={onTokenSelect}
              tokens={filteredTokens}
              disableToken={disableToken}
            />
          )}

          {/* </FixedSizeList> */}
          <div className={classes.buttons}>
            <CustomButton variant="light" onClick={onClose}>
              Cancel
            </CustomButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dex: state.dex,
  account: state.account,
});

export default connect(mapStateToProps, { importToken })(SelectTokenDialog);
