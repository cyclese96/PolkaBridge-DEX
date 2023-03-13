import React, { useCallback, useMemo } from "react";
import {
  useMediaQuery,
  useTheme,
  Box,
  Dialog,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useSelector } from "react-redux";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import { isMetaMaskInstalled } from "../../utils/helper";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import {
  AUTHENTICATION_STATE,
  CONNECTOR_TYPE,
} from "../../connection/connectionConstants";
import { Close } from "@mui/icons-material";
import { DAPP_SUPPORTED_ON_CHAINS } from "../../connection/chains";
import { Button, makeStyles } from "@material-ui/core";
import { switchChain } from "../../connection/switchChain";

const useStyles = makeStyles((theme) => ({
  background: {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,
    display: "grid",
    placeItems: "center",
    background: "rgba(0,0,0,0.2)",
  },
  container: {
    width: 500,
    maxHeight: "100%",
    overflowY: "auto",
    maxWidth: 788,
    position: "relative",
    background:
      theme.palette.mode === "light"
        ? "linear-gradient(180deg, #FFFFFF 0%, #D9E8FC 100%)"
        : theme.palette.background.primary,
    // border: "10px solid #6A55EA",
    padding: 8,
    borderRadius: 4,
    zIndex: 11,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: "95%",
    },
  },

  heading: {
    color: theme.palette.text.primary,
    fontWeight: 700,
    fontSize: 22,
    paddingRight: 20,
    letterSpacing: "0.01em",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    marginBottom: 15,
    [theme.breakpoints.down("md")]: {
      fontSize: 22,
      paddingRight: 10,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      paddingRight: 10,
    },
  },

  card: {
    padding: 25,
    color:
      theme.palette.mode === "light" ? theme.palette.text.primary : "#212121",
    border: "1px solid #919191",
    width: 300,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 18,
    marginBottom: 20,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      width: "80%",
      height: 80,
      fontSize: 14,
    },
  },
  switchBtn: {
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

const WalletModal = ({ popupActive, resetPopup }) => {
  const { connectWallet } = useUserAuthentication(true);
  const { isActive, chainId, connector } = useActiveWeb3React();

  const handleClose = () => {
    resetPopup();
  };

  const userSelectedChain = useSelector(
    (state) => state?.account?.currentChain
  );
  const authenticationState = useSelector(
    (state) => state?.account?.authenticationState
  );

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

  const classes = useStyles();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));

  const handleConnect = useCallback(
    (wallet) => {
      if (wallet === "metamask") {
        if (!isMetaMaskInstalled()) {
          window.open(
            "https://metamask.app.link/dapp/swap.polkabridge.org/",
            "_blank",
            "noopener,noreferrer"
          );
          return;
        }
        connectWallet(CONNECTOR_TYPE.injected);
        return;
      }

      if (wallet === "trustWallet") {
        window.open(
          "https://link.trustwallet.com/open_url?coin_id=637&url=https://swap.polkabridge.org/",
          "_blank",
          "noopener,noreferrer"
        );
        return;
      }

      if (wallet === "walletConnect") {
        connectWallet(CONNECTOR_TYPE.walletConnect);
        return;
      }
    },
    [connectWallet]
  );

  const handleSwitchNetwork = useCallback(async () => {
    // network swtich logic
    try {
      console.log("switch test user selected chain ", userSelectedChain);
      const switchRes = await switchChain(connector, userSelectedChain);
      console.log("switch test activating  chain switch failed ", switchRes);
    } catch (error) {
      console.log("switch test activating  chain switch failed ", error);
    }
  }, [userSelectedChain, connector]);

  const isConnectingState = useMemo(() => {
    return authenticationState === AUTHENTICATION_STATE.CONNECTING_WALLET;
  }, [authenticationState]);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={popupActive}
      // maxWidth="md"
    >
      <Box
        border="10px solid #D1FF1A"
        px={!sm ? "2vw" : "5%"}
        py={!sm ? "5vh" : "10%"}
        className={classes.popup}
      >
        <Box style={{ position: "absolute", right: "15px", top: "15px" }}>
          <Close
            style={{ color: theme.palette.text.primary, cursor: "pointer" }}
            onClick={handleClose}
          />
        </Box>

        <div className={classes.background}>
          <div className={classes.container}>
            <div className="d-flex justify-content-end">
              <Close
                style={{ color: theme.palette.text.primary, fontSize: 28 }}
                onClick={resetPopup}
              />
            </div>
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <Box className={classes.heading}>
                {isConnectingState &&
                  !isNetworkSwitchRequired &&
                  "Connect Wallet"}

                {isNetworkSwitchRequired && "Switch Network"}
              </Box>
            </div>

            {isConnectingState && (
              <Box
                mt={3}
                display={"flex"}
                flexDirection="column"
                alignItems="center"
              >
                <CircularProgress></CircularProgress>
                <Typography
                  fontSize={sm ? 13 : 16}
                  color={"#919191"}
                  fontWeight={sm ? 400 : 500}
                  mb={sm ? 0.5 : 1}
                >
                  Waiting to connect
                </Typography>

                <Typography
                  fontSize={sm ? 13 : 16}
                  color={"#919191"}
                  fontWeight={600}
                  mb={sm ? 0.5 : 1}
                >
                  Confirm this connection in your wallet
                </Typography>
                <Typography
                  style={{
                    backgroundColor: "#d1c4e9",
                    padding: 5,
                    borderRadius: 5,
                    color:
                      theme.palette.mode === "light"
                        ? theme.palette.text.primary
                        : "#212121",
                    textAlign: "center",
                  }}
                  mt={3}
                >
                  By connecting a wallet, you agree to Polkabridge AMM Terms of
                  Service and consent to its Privacy Policy.
                </Typography>
              </Box>
            )}

            {isNetworkSwitchRequired && (
              <Box
                mt={3}
                mb={5}
                display={"flex"}
                flexDirection="column"
                alignItems="center"
              >
                <Button
                  className={classes.switchBtn}
                  onClick={handleSwitchNetwork}
                >
                  Switch Network
                </Button>
              </Box>
            )}
            {!isConnectingState && !isNetworkSwitchRequired && (
              <Box
                mt={3}
                display={"flex"}
                flexDirection="column"
                alignItems="center"
              >
                <Box
                  className={classes.card}
                  style={{ backgroundColor: "#d1c4e9" }}
                  onClick={() => handleConnect("metamask")}
                >
                  <img
                    src="img/metamask.png"
                    height="30px"
                    alt="metamask"
                    style={{ marginRight: 10 }}
                  />
                  Metamask
                </Box>
                <Box
                  className={classes.card}
                  style={{ backgroundColor: "#d1c4e9" }}
                  onClick={() => handleConnect("walletConnect")}
                >
                  <img
                    src="img/walletConnect.svg"
                    alt="walletConnect"
                    height="27px"
                    style={{ marginRight: 10 }}
                  />{" "}
                  Wallet Connect
                </Box>
              </Box>
            )}
          </div>
        </div>
      </Box>
    </Dialog>
  );
};

export default WalletModal;
