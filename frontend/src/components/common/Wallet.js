import { Button, makeStyles } from "@material-ui/core";
import { AccountBalanceWallet } from "@material-ui/icons";
import { connect, useSelector } from "react-redux";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import WalletModal from "./WalletModal";
import { AUTHENTICATION_STATE } from "../../connection/connectionConstants";
import { DAPP_SUPPORTED_ON_CHAINS } from "../../connection/chains";
import AccountDialog from "./AccountDialog";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";

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
  smallBtn: {
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
  largeButton: {
    marginTop: 30,
    backgroundColor: theme.palette.primary.pbr,
    color: "white",
    width: "auto",
    height: 45,
    textTransform: "none",
    fontSize: 19,
    borderRadius: 20,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    padding: "12px 50px 12px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
}));

const Wallet = () => {
  const classes = useStyles();
  const { isActive, account, chainId } = useActiveWeb3React();
  const [walletPopup, setWalletPopup] = useState(true);
  const [accountDialog, setAccountDialog] = useState(false);
  const { logout } = useUserAuthentication();

  const authenticationState = useSelector(
    (state) => state?.account?.authenticationState
  );

  useEffect(() => {
    if (authenticationState === AUTHENTICATION_STATE.CONNECTING_WALLET) {
      setWalletPopup(true);
    } else if (authenticationState === AUTHENTICATION_STATE.WALLET_CONNECTED) {
      setWalletPopup(false);
    }
  }, [authenticationState]);

  const isDappSupported = useMemo(() => {
    if (!chainId) {
      return false;
    }

    if (!DAPP_SUPPORTED_ON_CHAINS.includes(chainId)) {
      return false;
    }

    return true;
  }, [chainId]);

  const isNetworkSwitchRequired = useMemo(() => {
    if (isActive && !isDappSupported) {
      return true;
    }

    return false;
  }, [isActive, isDappSupported]);

  const handleLogout = () => {
    logout();
  };

  const handleWalletConnect = useCallback(() => {
    if (isActive && !isNetworkSwitchRequired) {
      setAccountDialog(true);
    } else {
      setWalletPopup(true);
    }
  }, [
    accountDialog,
    setAccountDialog,
    isActive,
    walletPopup,
    setWalletPopup,
    isNetworkSwitchRequired,
  ]);

  return (
    <div>
      <AccountDialog
        open={accountDialog}
        handleLogout={handleLogout}
        handleClose={() => setAccountDialog(false)}
      />
      <WalletModal
        popupActive={walletPopup}
        resetPopup={() => setWalletPopup(false)}
      />
      {(!isActive || isNetworkSwitchRequired) && (
        <Button onClick={handleWalletConnect} className={classes.smallBtn}>
          {isNetworkSwitchRequired ? "Switch network" : "Connect wallet"}
        </Button>
      )}

      {isActive && !isNetworkSwitchRequired && (
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
