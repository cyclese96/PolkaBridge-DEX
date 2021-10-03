import "./App.css";
import React, { useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Fragment } from "react";
import Home from "./components/Home";
import { Provider } from "react-redux";
import store from "./store";
import "./web";
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import { TOKEN_BLACKLIST } from "./constants";
import TokenPage from "./components/pages/Analytics/TokenDetail";
import { isAddress } from "./utils/helper";


function App() {

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route exact path="/" component={Home} />

          <Switch>
            <Route
              exacts
              strict
              path="/token/:tokenAddress"
              render={({ match }) => {
                if (
                  isAddress(match.params.tokenAddress.toLowerCase()) &&
                  !Object.keys(TOKEN_BLACKLIST).includes(match.params.tokenAddress.toLowerCase())
                ) {
                  return (
                    // <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                    <TokenPage address={match.params.tokenAddress.toLowerCase()} />
                    // </LayoutWrapper>
                  )
                } else {
                  return <Redirect to="/" />
                }
              }}
            />
            {/* <Route
                exacts
                strict
                path="/pair/:pairAddress"
                render={({ match }) => {
                  if (
                    isAddress(match.params.pairAddress.toLowerCase()) &&
                    !Object.keys(PAIR_BLACKLIST).includes(match.params.pairAddress.toLowerCase())
                  ) {
                    return (
                      // <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                        <PairPage pairAddress={match.params.pairAddress.toLowerCase()} />
                      // </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/" />
                  }
                }}
              /> */}

            {/* <Route
              exacts
              strict
              path="/account/:accountAddress"
              render={({ match }) => {
                if (isAddress(match.params.accountAddress.toLowerCase())) {
                  return (
                    <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                      <AccountPage account={match.params.accountAddress.toLowerCase()} />
                    </LayoutWrapper>
                  )
                } else {
                  return <Redirect to="/home" />
                }
              }}
            /> */}


          </Switch>
        </BrowserRouter>


      </ThemeProvider>
    </Provider>
  );
}

export default App;
