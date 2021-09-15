import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { logout } from "../../actions/accountActions";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SelectTokenDialog from "./SelectTokenDialog";
import tokenThumbnail from "../../utils/tokenThumbnail";
import { Card } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  token: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "black",
    border: "0.5px solid #616161",
    borderRadius: 12,
    paddingLeft: 8,
    paddingRight: 0,
    paddingTop: 2,
    paddingBottom: 2,
    height: 35,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  noToken: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(224, 7, 125, 0.9)",

    borderRadius: 12,
    paddingLeft: 13,
    paddingRight: 0,
    paddingTop: 2,
    paddingBottom: 2,
    height: 35,
    cursor: "pointer",
  },
  tokenIcon: {
    width: "auto",
    height: 22,
    marginRight: 2,
    borderRadius: "50%",
    color: "#e5e5e5",
  },

  selectToken: {
    fontSize: 15,
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  selectedToken: {
    color: "white",
    marginLeft: 5,
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  dropIcon: {
    color: "#e5e5e5",
  },
}));

const SelectToken = ({
  selectedToken,
  onClick,
  handleTokenSelected,
  className,
  disableToken,
}) => {
  const [tokensOpen, setTokensOpen] = useState(false);

  const classes = useStyles();

  const handleTokensOpen = () => {
    setTokensOpen(true);
  };

  const tokensClose = () => {
    setTokensOpen(false);
  };

  return (
    <Card
      elevation={30}
      style={{
        backgroundColor: "transparent",
        filter: `drop-shadow(0 0 0.5rem #212121)`,
      }}
    >
      <SelectTokenDialog
        open={tokensOpen}
        handleClose={tokensClose}
        handleTokenSelected={handleTokenSelected}
        disableToken={disableToken}
      />
      <span
        className={
          selectedToken.symbol
            ? [classes.token, className].join(" ")
            : [classes.noToken, className].join(" ")
        }
        onClick={handleTokensOpen}
      >
        {selectedToken.symbol && (
          <img
            className={classes.tokenIcon}
            src={tokenThumbnail(selectedToken.symbol)}
            alt={""}
          />
        )}

        {!selectedToken.symbol ? (
          <span className={classes.selectToken}>Select a token</span>
        ) : (
          <span className={classes.selectedToken}>{selectedToken.symbol}</span>
        )}
        <ArrowDropDownIcon className={classes.dropIcon} />
      </span>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(SelectToken);
