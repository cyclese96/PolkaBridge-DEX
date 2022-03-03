import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import ApplicationContextProvider from "../src/contexts/Application";
import GlobalDataContextProvider from "../src/contexts/GlobalData";
import TokenDataContextProvider, {
  Updater as TokenDataContextUpdater,
} from "../src/contexts/TokenData";
import PairDataContextProvider, {
  Updater as PairDataContextUpdater,
} from "../src/contexts/PairData";
import MulticallUpdater from "./state/multicall/updater";
import { BlockUpdater } from "./hooks/useBlockNumber";
import { createWeb3ReactRoot, Web3ReactProvider } from "web3-react-core";

import { Provider } from "react-redux";
import store from "./store";

import getLibrary from "./utils/getLibrary";
import { NetworkContextName } from "./constants/index";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function ContextProviders({ children }) {
  return (
    <ApplicationContextProvider>
      <TokenDataContextProvider>
        <GlobalDataContextProvider>
          <PairDataContextProvider>{children}</PairDataContextProvider>
        </GlobalDataContextProvider>
      </TokenDataContextProvider>
    </ApplicationContextProvider>
  );
}

function Updaters() {
  return (
    <>
      <TokenDataContextUpdater />
      <PairDataContextUpdater />
    </>
  );
}

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <MulticallUpdater />
          <BlockUpdater />
          <ContextProviders>
            <Updaters />
            <App />
          </ContextProviders>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
