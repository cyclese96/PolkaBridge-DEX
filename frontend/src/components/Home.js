import React, { useEffect } from "react";
import { connect } from "react-redux";
import store from "../store";
import { getNetworkNameById } from "../utils/helper";
import { CHANGE_NETWORK, CONNECT_WALLET } from "../actions/types";
import { loadTokens } from "../actions/dexActions";
// import { etheriumNetwork } from "../constants/index";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

const Home = ({ loadTokens }) => {
  const { active, account, chainId } = useActiveWeb3React();

  useEffect(() => {
    // if (!chainId || !active) {
    //   loadTokens(etheriumNetwork);
    //   return;
    // }

    const _network = getNetworkNameById(chainId);

    store.dispatch({
      type: CONNECT_WALLET,
      payload: account,
    });
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: _network,
    });

    loadTokens(chainId);
  }, [chainId, active, account, loadTokens]);

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

        window.ethereum.on("chainChanged", (chainId) => {
          window.location.reload();
        });
      }
    }
    onNetworkChangeUpdate();
  }, []);

  return <></>;
};

export default connect(null, {
  loadTokens,
})(Home);
