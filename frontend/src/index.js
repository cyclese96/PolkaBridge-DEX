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

ReactDOM.render(
  <React.StrictMode>
    <ContextProviders>
      <>
        <Updaters />
        <App />
      </>
    </ContextProviders>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
