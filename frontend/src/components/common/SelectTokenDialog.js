import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import TokenList from "./TokenList";
import { importToken } from "../../actions/dexActions";
import { connect } from "react-redux";
import { Button, CircularProgress, Divider } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#ffffff",
    color: theme.palette.primary.iconColor,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 400,
    height: 600,
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
      height: "100%",
      maxHeight: "80vh",
    },
  },
  heading: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: "left",

    color: theme.palette.primary.iconColor,
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
    },
  },

  input: {
    backgroundColor: "transparent",
    borderRadius: 5,
    height: 50,
    width: "auto",
    border: "1px solid rgba(224, 224, 224,1)",
    borderRadius: 15,
    fontSize: 18,
    width: "90%",
    color: theme.palette.primary.iconColor,
    padding: 10,
    outline: "none",
    [theme.breakpoints.down("sm")]: {
      height: 45,
      fontSize: 15,
    },
  },
  buttons: {
    marginBottom: 7,
  },

  closeIcon: {
    color: "#f6f6f6",
    fontSize: 24,
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.primary.iconBack,
    color: theme.palette.primary.iconColor,
    width: "100%",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 20,
    padding: "8px 50px 8px 50px",

    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
}));

const SelectTokenDialog = ({
  open,
  handleClose,
  handleTokenSelected,
  disableToken,
  dex: { tokenList, importedToken, dexLoading },
}) => {
  const classes = useStyles();

  const [filteredTokens, setTokens] = useState([]);
  const [filterInput, setFilterInput] = useState("");

  const onTokenSelect = (token) => {
    handleTokenSelected(token);
    handleClose();
  };

  useEffect(() => {
    if (open) {
      setTokens(tokenList);
    }
  }, [tokenList, open]);

  useEffect(() => {
    if (importedToken.symbol) {
      const filteredList = applyFilter(tokenList, importedToken.symbol);
      setTokens(filteredList);
    }
  }, [importedToken, tokenList]);

  const applyFilter = (list, value) => {
    const filtered = list.filter(
      (item) =>
        (item.symbol &&
          item.symbol
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())) ||
        (item.name &&
          item.name.toLowerCase().includes(value.toLocaleLowerCase())) ||
        (item.address &&
          item.address.toLowerCase().includes(value.toLocaleLowerCase()))
    );

    return filtered;
  };

  const handleTokenFilter = async (value) => {
    setFilterInput(value);
    if (!value) {
      value = "";
    }

    const _value = value.split(" ").join("");
    const filteredList = applyFilter(tokenList, _value);
    setTokens(filteredList);
  };

  const resetInputState = () => {
    handleTokenFilter("");
  };

  const onClose = () => {
    handleClose();
    resetInputState();
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
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
          value={filterInput}
          placeholder="Search name or paste address"
          onChange={({ target: { value } }) => handleTokenFilter(value)}
        />
        <Divider
          style={{
            width: "100%",
            borderTop: "1px solid #616161",
            marginTop: 15,
          }}
        />
        {dexLoading ? (
          <CircularProgress />
        ) : filteredTokens.length === 0 ? (
          <span style={{ marginTop: 10 }}>No tokens found</span>
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
});

export default connect(mapStateToProps, { importToken })(
  React.memo(SelectTokenDialog)
);
