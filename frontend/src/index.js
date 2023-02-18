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
import { Provider } from "react-redux";
import store from "./store";
import Web3Provider from "connection/Web3Provider";

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
      <Web3Provider>
        <MulticallUpdater />
        <BlockUpdater />
        <ContextProviders>
          <Updaters />
          <App />
        </ContextProviders>
      </Web3Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
