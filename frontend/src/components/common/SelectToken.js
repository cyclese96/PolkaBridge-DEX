import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { logout } from "../../actions/accountActions";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SelectTokenDialog from "./SelectTokenDialog";

const useStyles = makeStyles((theme) => ({
  token: {
    display: "flex",
    alignItems: "center",
    border: "0.5px solid white",
    borderRadius: 12,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    height: 35,
    width: 110,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  tokenIcon: {
    width: 25,
    height: "auto",
    marginRight: 2,
  },
}));

const SelectToken = ({
  selectedToken,
  onClick,
  handleTokenSelected,
  className,
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
    <>
      <SelectTokenDialog
        open={tokensOpen}
        handleClose={tokensClose}
        handleTokenSelected={handleTokenSelected}
      />
      <a
        className={[classes.token, className].join(" ")}
        onClick={handleTokensOpen}
      >
        <img className={classes.tokenIcon} src={selectedToken.icon} alt={""} />
        <span style={{ color: "white", marginLeft: 5 }}>
          {selectedToken.symbol}
        </span>
        <ArrowDropDownIcon />
      </a>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(SelectToken);
