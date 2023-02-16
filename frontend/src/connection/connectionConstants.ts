import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import { RPC_URLS } from "./infura";

export enum ConnectionType {
  INJECTED = "INJECTED",
  WALLET_CONNECT = "WALLET_CONNECT",
}

export const CONNECTOR_TYPE = {
  injected: "injected",
  walletConnect: "walletConnect",
};

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError })
);
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
};

const [web3WalletConnect, web3WalletConnectHooks] =
  initializeConnector<WalletConnect>((actions) => {
    // Avoid testing for the best URL by only passing a single URL per chain.
    // Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
    const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
      (map, [chainId, urls]) => ({
        ...map,
        [chainId]: RPC_URLS?.[chainId]?.[0],
      }),
      {}
    );
    return new WalletConnect({
      actions,
      options: {
        rpc: RPC_URLS_WITHOUT_FALLBACKS,
        qrcode: true,
      },
      onError,
    });
  });
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
};

export const AUTHENTICATION_STATE = {
  NOT_STARTED: "NOT_STARTED",
  CONNECTING_WALLET: "CONNECTING_WALLET",
  WALLET_CONNECTED: "WALLET_CONNECTED",
  WALLET_CONNECTION_FAILED: "WALLET_CONNECTION_FAILED",
  NETWORK_SWITCH_REQUEST: "NETWORK_SWITCH_REQUEST",
  NETWORK_SWITCH_FAILED: "NETWORK_SWITCH_FAILED",
};
