import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import TokenList from "./TokenList";
import { importToken } from "../../actions/dexActions";
import { connect } from "react-redux";
import { Button, CircularProgress, Divider } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { isAddress } from "utils/contractUtils";
import useActiveWeb3React from "hooks/useActiveWeb3React";

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
    height: 50,
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
    color: theme.palette.textColors.heading,
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
  dex: { tokenList, dexLoading },
  importToken,
}) => {
  const classes = useStyles();

  const [filterInput, setFilterInput] = useState("");
  const { chainId } = useActiveWeb3React();

  const onTokenSelect = (token) => {
    handleTokenSelected(token);
    handleClose();
  };

  const filteredTokenList = useMemo(() => {
    if (!tokenList) {
      return [];
    }

    const filtered =
      tokenList &&
      tokenList.filter(
        (item) =>
          (item.symbol &&
            item.symbol
              .toLocaleLowerCase()
              .includes(filterInput.toLocaleLowerCase())) ||
          (item.name &&
            item.name
              .toLowerCase()
              .includes(filterInput.toLocaleLowerCase())) ||
          (item.address &&
            item.address
              .toLowerCase()
              .includes(filterInput.toLocaleLowerCase()))
      );

    return filtered;
  }, [tokenList, filterInput]);

  const handleTokenFilter = async (value) => {
    if (!value) {
      const _value = "";
      setFilterInput(_value);
      return;
    }

    const _value = value.split(" ").join("");

    if (isAddress(_value)) {
      importToken(_value, chainId);
    }

    setFilterInput(_value);
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
        ) : filteredTokenList.length === 0 ? (
          <span style={{ marginTop: 10 }}>No tokens found</span>
        ) : (
          <TokenList
            handleItemSelected={onTokenSelect}
            tokens={filteredTokenList}
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
          <Button onClick={onClose} className={classes.cancelButton}>
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
