import React, { useEffect } from "react";
import { connectWallet } from "../actions/accountActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../store";

import { getNetworkNameById } from "../utils/helper";
import { CHANGE_NETWORK, CONNECT_WALLET } from "../actions/types";
import { loadTokens } from "../actions/dexActions";
import { getAccountBalance } from "../actions/accountActions";
import { useWeb3React } from "@web3-react/core";

const Home = ({
  connectWallet,
  loadTokens,
  account: { currentNetwork },
  getAccountBalance,
}) => {
  const { active, account, chainId } = useWeb3React();

  // const getCurrentNetwork = (networkId) => {
  //   if (
  //     networkId === bscConfig.network_id.mainnet ||
  //     networkId === bscConfig.network_id.testnet
  //   ) {
  //     return bscNetwork;
  //   } else if (
  //     networkId === etherConfig.network_id.mainet ||
  //     networkId === etherConfig.network_id.koven
  //   ) {
  //     return etheriumNetwork;
  //   } else {
  //     return etheriumNetwork;
  //   }
  // };

  // useEffect(() => {
  //   async function listenConnectionUpdate() {
  //     if (typeof window.web3 !== "undefined") {
  //       window.ethereum.on("accountsChanged", async (accounts) => {
  //         if (accounts.length === 0) {
  //           return;
  //         }

  //         await connectWallet(false, currentNetwork);
  //       });

  //       window.ethereum.on("networkChanged", async (networkId) => {
  //         // setCurrentNetwork(networkId)
  //         const network = getCurrentNetwork(networkId);

  //         store.dispatch({
  //           type: CHANGE_NETWORK,
  //           payload: network,
  //         });
  //         await connectWallet(false, network);
  //       });
  //     }
  //   }
  //   listenConnectionUpdate();
  // }, []);

  // useEffect(() => {
  //   async function initConnection() {
  //     let network = "";
  //     const account = await getCurrentAccount();

  //     if (isMetaMaskInstalled()) {
  //       const networkId = await getCurrentNetworkId();

  //       if (!supportedNetworks.includes(networkId.toString())) {
  //         // alert(
  //         //   "This network is not supported yet! Please switch to Ethereum or Smart Chain network"
  //         // );
  //       }
  //       network = getCurrentNetwork(networkId.toString());
  //       // alert(`current network set to  ${network}` )
  //       store.dispatch({
  //         type: CHANGE_NETWORK,
  //         payload: network,
  //       });
  //     } else {
  //       // alert('meta mask not installed')
  //       network = etheriumNetwork;
  //     }

  //     if (!isMetaMaskInstalled()) {
  //       return;
  //     }
  //     await Promise.all([connectWallet(false, network), loadTokens(network)]);
  //   }
  //   initConnection();
  // }, []);

  useEffect(() => {
    if (!chainId || !active) {
      return;
    }

    const _network = getNetworkNameById(chainId);

    store.dispatch({
      type: CONNECT_WALLET,
      payload: account,
    });
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: _network,
    });

    getAccountBalance(account, _network);
    loadTokens(_network);
  }, [chainId, active, account]);

  useEffect(() => {
    async function onNetworkChangeUpdate() {
      if (typeof window.web3 !== "undefined") {
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length === 0) {
            localStorage.connected = "none";
            return;
          }
        });

        window.ethereum.on("disconnect", (error) => {
          console.log("disconnected ", error);
          localStorage.connected = "none";
        });
      }
    }
    onNetworkChangeUpdate();
  }, []);

  return <></>;
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
  getAccountBalance,
})(Home);
