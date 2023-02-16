import { Connector } from "@web3-react/types";
import {
  injectedConnection,
  walletConnectConnection,
} from "connection/connectionConstants";
import { useEffect } from "react";

import { isMetaMaskInstalled } from "../utils/helper";

export async function connect(connector: Connector) {
  try {
    await connector.activate();
  } catch (error) {
    console.log(`web3-react eager connection error: ${error}`);
  }
}

export default function useEagerlyConnect() {
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      connect(injectedConnection.connector);
    } else {
      connect(walletConnectConnection.connector);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
