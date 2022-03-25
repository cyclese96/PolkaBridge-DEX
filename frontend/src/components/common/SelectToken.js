import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { logout } from "../../actions/accountActions";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SelectTokenDialog from "./SelectTokenDialog";
import TokenIcon from "./TokenIcon";

const useStyles = makeStyles((theme) => ({
  token: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.primary.iconBack,
    borderRadius: 20,
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
    "&:hover": {
      background: "rgba(224, 1, 125, 0.7)",
    },
  },
  tokenIcon: {
    width: "auto",
    height: 22,
    marginRight: 2,
    borderRadius: "50%",
    color: "#e5e5e5",
    [theme.breakpoints.down("sm")]: {
      height: 22,
    },
  },
  selectToken: {
    fontSize: 15,
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  selectedToken: {
    color: "#000000",
    marginLeft: 5,
    fontSize: 15,
    fontWeight: 400,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  dropIcon: {
    color: "#bdbdbd",
  },
}));

const SelectToken = ({
  selectedToken,
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
    <div>
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
        {selectedToken.symbol && <TokenIcon address={selectedToken?.address} />}

        {!selectedToken.symbol ? (
          <span className={classes.selectToken}>Select</span>
        ) : (
          <span className={classes.selectedToken}>{selectedToken.symbol}</span>
        )}
        <ArrowDropDownIcon className={classes.dropIcon} />
      </span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(React.memo(SelectToken));
