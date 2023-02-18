import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import {
  Connection,
  ConnectionType,
  injectedConnection,
  walletConnectConnection,
} from "../connectionConstants";
import { ReactNode, useMemo } from "react";

import useOrderedConnections from "./useOrderedConnections";

export default function Web3Provider({ children }: { children: ReactNode }) {
  // useEagerlyConnect();
  const connections = useOrderedConnections();
  const connectors: [Connector, Web3ReactHooks][] = connections.map(
    ({ hooks, connector }) => [connector, hooks]
  );

  const key = useMemo(
    () =>
      connections
        .map(({ type }: Connection) => getConnectionName(type))
        .join("-"),
    [connections]
  );

  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      {/* <Tracer /> */}
      {children}
    </Web3ReactProvider>
  );
}

const CONNECTIONS = [injectedConnection, walletConnectConnection];

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find(
      (connection) => connection.connector === c
    );
    if (!connection) {
      throw Error("unsupported connector");
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection;

      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection;
    }
  }
}

export function getConnectionName(
  connectionType: ConnectionType,
  isMetaMask?: boolean
) {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return isMetaMask ? "MetaMask" : "Injected";

    case ConnectionType.WALLET_CONNECT:
      return "WalletConnect";
  }
}
