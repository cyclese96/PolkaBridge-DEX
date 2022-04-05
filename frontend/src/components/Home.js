import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";

import { loadTokens } from "../actions/dexActions";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

const Home = ({ loadTokens }) => {
  const { active, account } = useActiveWeb3React();
  const selectedChain = useSelector(state => state.account?.currentChain);

  useEffect(() => {


    loadTokens(selectedChain);
  }, [selectedChain, active, account, loadTokens]);

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
