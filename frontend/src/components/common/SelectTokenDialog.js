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
import { Button, CircularProgress, Divider } from "@material-ui/core";
import { Close } from "@material-ui/icons";

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
      width: "75vw",
      height: 500,
    },
  },
  heading: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: "left",
    color: "#e5e5e5",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  subheading: {
    fontSize: 12,
    fontWeight: 400,
    color: "#919191",
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
    borderRadius: 15,
    fontSize: 18,
    width: "90%",
    color: "white",
    padding: 10,
    outline: "none",
    [theme.breakpoints.down("sm")]: {
      height: 35,
      fontSize: 13,
    },
  },
  buttons: {
    marginBottom: 7,
  },

  numbers: {
    color: "#E0077D",
    fontSize: 20,
    marginLeft: 15,
  },
  icon: {
    color: "#e5e5e5",
  },
  closeIcon: {
    color: "#f6f6f6",
    fontSize: 24,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  cancelButton: {
    backgroundColor: "#2C2F35",
    color: "white",
    width: "100%",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 20,

    padding: "8px 50px 8px 50px",

    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
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
    <Dialog
      onClose={onClose}
      open={open}
      // onLoad={() => filterTokens("")}
      disableBackdropClick
      className={classes.dialog}
      color="transparent"
      PaperProps={{
        style: { borderRadius: 20, backgroundColor: "#121827" },
      }}
    >
      <div className={classes.background}>
        <div
          className="d-flex justify-content-between"
          style={{ width: "90%", paddingTop: 20, paddingBottom: 15 }}
        >
          <div className={classes.heading}>Select a token</div>
          <div>
            <IconButton style={{ margin: 0, padding: 0 }}>
              <Close onClick={onClose} className={classes.closeIcon}></Close>
            </IconButton>
          </div>
        </div>

        <input
          type="text"
          className={classes.input}
          placeholder="Search name or paste address"
          onChange={({ target: { value } }) => handleTokenFilter(value)}
        />
        {/* <FixedSizeList> */}
        <Divider
          style={{
            width: "100%",
            borderTop: "1px solid #616161",
            marginTop: 15,
          }}
        />
        {dexLoading ? (
          <CircularProgress />
        ) : (
          <TokenList
            handleItemSelected={onTokenSelect}
            tokens={filteredTokens}
            disableToken={disableToken}
          />
        )}
        <Divider
          style={{
            width: "100%",
            borderTop: "1px solid #616161",
            marginTop: 15,
            marginBottom: 10,
          }}
        />
        {/* </FixedSizeList> */}
        <div className={classes.buttons}>
          <Button
            variant="contained"
            onClick={onClose}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  dex: state.dex,
  account: state.account,
});

export default connect(mapStateToProps, { importToken })(SelectTokenDialog);
