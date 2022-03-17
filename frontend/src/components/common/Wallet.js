import { Button, makeStyles } from "@material-ui/core";
import { AccountBalanceWallet } from "@material-ui/icons";
import { connect } from "react-redux";

import React, { useCallback } from "react";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: theme.palette.primary.pbr,
    color: theme.palette.primary.buttonText,
    borderRadius: 15,
    padding: 6,
    paddingLeft: 15,
    paddingRight: 15,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(224, 208, 217,1)",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 15,
      paddingRight: 15,
      marginLeft: 25,
    },
  },
  navbarButton: {
    backgroundColor: theme.palette.primary.iconBack,
    color: theme.palette.primary.iconColor,
    borderRadius: 15,
    height: 35,
    marginRight: 40,
    padding: 15,
    fontSize: 14,
    fontWeight: 700,
    textTransform: "none",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.7)",
    },
    [theme.breakpoints.down("md")]: {
      marginRight: 0,
      marginLeft: 25,
      width: "fit-content",
      backgroundColor: theme.palette.primary.buttonColor,
      padding: 6,
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  numbers: {
    color: "#f9f9f9",
    fontSize: 14,
  },
}));

const Wallet = ({ onWalletClick }) => {
  const classes = useStyles();
  const { active, account } = useActiveWeb3React();

  const handleWalletConnect = useCallback(() => {
    onWalletClick();
  }, [onWalletClick]);

  return (
    <div>
      {!active ? (
        <Button onClick={handleWalletConnect} className={classes.navbarButton}>
          Connect Wallet
        </Button>
      ) : (
        <Button onClick={handleWalletConnect} className={classes.root}>
          <AccountBalanceWallet
            style={{ marginRight: 5, fontSize: 20 }}
            fontSize="medium"
          />
          <strong className={classes.numbers}>
            {account ? <span></span> : "..."}
            {account?.slice(0, 3)}
            {"..."}
            {account?.slice(account?.length - 4, account?.length)}
          </strong>
        </Button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(React.memo(Wallet));
