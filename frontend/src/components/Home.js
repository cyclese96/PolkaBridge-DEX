import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect, useState } from "react";
import { connectWallet } from "../actions/accountActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../store";
import {
  etheriumNetwork,
  supportedNetworks,
} from "../constants";
import {
  isMetaMaskInstalled,
  getCurrentNetworkId,
  getCurrentAccount,
} from "../utils/helper";
import { CHANGE_NETWORK } from "../actions/types";
import { loadTokens } from "../actions/dexActions";
import Navbar from "./common/Navbar";
import { getCurrentNetwork } from "../utils/connectionUtils";

const useStyles = makeStyles((theme) => ({
  navbar: {
    position: "relative",
    top: 0,
  },
  mainContent: {
    marginTop: 10,
    minHeight: `calc(100vh - 120px)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  footer: {
    width: "100vw",
    display: "flex",
    justifyContent: "center",

    paddingBottom: 20,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      width: "100%",
    },
  },
  background: {
    height: "90vh",
  },

  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      width: "100%",
    },
  },
  subheading: {
    fontSize: 16,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
    marginLeft: 5,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  logo: {
    width: 95,
    height: 95,
    marginTop: 5,
    marginBottom: 40,
    backgroundColor: "#f9f9f9",
    padding: 12,
  },
}));

const Home = ({ connectWallet, loadTokens, account: { currentNetwork } }) => {
  const classes = useStyles();
  const [currentChainId, setCurrentChainId] = useState(null);


  useEffect(() => {
    async function listenConnectionUpdate() {
      if (typeof window.web3 !== "undefined") {
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length === 0) {
            return;
          }

          await connectWallet(false, currentNetwork);
        });

        window.ethereum.on("networkChanged", async (networkId) => {
          // setCurrentNetwork(networkId)
          const network = getCurrentNetwork(networkId);
          setCurrentChainId(parseInt(networkId));
          store.dispatch({
            type: CHANGE_NETWORK,
            payload: network,
          });

          await connectWallet(false, network)
          await loadTokens(network);
          console.log('reloading...', { network, networkId })
        });

        // todo: handle more ethereum event
        //1. on transaction update balance
      }
    }
    listenConnectionUpdate();
  }, []);

  useEffect(() => {
    async function initConnection() {
      let network = "";
      const account = await getCurrentAccount();

      if (isMetaMaskInstalled()) {
        const networkId = await getCurrentNetworkId();

        console.log('current networl id ', networkId)

        setCurrentChainId(parseInt(networkId));
        if (!supportedNetworks.includes(networkId.toString())) {
          // alert(
          //   "This network is not supported yet! Please switch to Ethereum or Smart Chain network"
          // );
        }
        network = getCurrentNetwork(networkId.toString());
        // alert(`current network set to  ${network}` )
        store.dispatch({
          type: CHANGE_NETWORK,
          payload: network,
        });
      } else {
        // alert('meta mask not installed')
        network = etheriumNetwork;
      }

      if (!isMetaMaskInstalled()) {
        return;
      }
      await connectWallet(false, network)
      await loadTokens(network);
    }
    initConnection();
  }, []);

  return <><div className={classes.navbar}>
    <Navbar currentNetwork={currentNetwork} chainId={currentChainId} />
  </div></>;
};

Home.propTypes = {
  connectWallet: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {
  connectWallet,
  loadTokens,
})(Home);
