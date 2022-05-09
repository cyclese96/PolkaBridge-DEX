import { CHANGE_NETWORK, CONNECT_WALLET } from "actions/types";
import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import store from "../store";
import { getCurrentNetworkName } from "utils/helper";

import { loadTokens } from "../actions/dexActions";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

const Home = ({ loadTokens }) => {
  const { active, account, chainId } = useActiveWeb3React();
  const currentChain = useSelector((state) => state.account?.currentChain);

  useEffect(() => {
    loadTokens(currentChain);
  }, [currentChain, active, account, loadTokens]);

  useEffect(() => {
    if (!chainId || !active) {
      // check if there is existing cached selected network other wise select ethereum chain by default

      const cachedChain = localStorage.getItem("cachedChain");
      if (!cachedChain) {
        localStorage.setItem("cachedChain", 1);
      }

      const _network = getCurrentNetworkName(cachedChain || 1);
      console.log("setting cached chain to select chain id ", cachedChain || 1);

      store.dispatch({
        type: CHANGE_NETWORK,
        payload: { network: _network, chain: cachedChain || 1 },
      });

      return;
    }

    const _network = getCurrentNetworkName(chainId);

    store.dispatch({
      type: CONNECT_WALLET,
      payload: account,
    });
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: { network: _network, chain: chainId },
    });
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

  useEffect(() => {
    if (!currentChain) {
      return;
    }
    const cachedChain = localStorage.getItem("cachedChain");

    if (cachedChain && currentChain?.toString() !== cachedChain) {
      localStorage.setItem("cachedChain", currentChain?.toString());

      window.location.reload();
    } else if (!cachedChain) {
      localStorage.setItem("cachedChain", currentChain?.toString());
    }
  }, [currentChain]);

  return <></>;
};

export default connect(null, {
  loadTokens,
})(Home);
