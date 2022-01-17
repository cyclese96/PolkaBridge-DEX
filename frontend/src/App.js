import "./App.css";
import React from "react";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import theme from "./theme";
import Home from "./components/Home";
import { Provider } from "react-redux";
import store from "./store";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { PAIR_BLACKLIST, TOKEN_BLACKLIST } from "./constants";
import TokenPage from "./components/pages/Analytics/components/DetailsPage/TokenDetail";
import { isAddress } from "./utils/helper";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Swap from "./components/pages/Swap";
import AddLiquidity from "./components/pages/AddLiquidity";
import PoolDetail from "./components/pages/Analytics/components/DetailsPage/PoolDetail";
import Analytics from "./components/pages/Analytics/Analytics";
import AllTopToken from "./components/pages/Analytics/components/Tables/AllTopToken";
import AllTopPool from "./components/pages/Analytics/components/Tables/AllTopPool";
import Farms from "./components/pages/Farms";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

const useStyles = makeStyles((theme) => ({
  navbar: {
    position: "relative",
    top: 0,
  },
  mainContent: {
    marginTop: 10,
    minHeight: `calc(100vh - 120px)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  footer: {
    width: "100vw",
    display: "flex",
    justifyContent: "center",

    paddingBottom: 20,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      width: "100%",
    },
  },
}));

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const classes = useStyles();
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider theme={theme}>
          <div style={{ overflowX: "hidden" }}>
            <div className={classes.navbar}>
              <Navbar />
            </div>
            <div className={classes.mainContent}>
              <BrowserRouter>
                <Home />
                <Route exact path="/" component={Swap} />
                <Route exact path="/farms" component={Farms} />
                <Route exact path="/liquidity" component={AddLiquidity} />
                <Route exact path="/charts" component={Analytics} />
                <Route exact path="/charts/tokens" component={AllTopToken} />
                <Route exact path="/charts/pools" component={AllTopPool} />

                <Switch>
                  <Route
                    exacts
                    strict
                    path="/token/:tokenAddress"
                    render={({ match }) => {
                      if (
                        isAddress(match.params.tokenAddress.toLowerCase()) &&
                        !Object.keys(TOKEN_BLACKLIST).includes(
                          match.params.tokenAddress.toLowerCase()
                        )
                      ) {
                        return (
                          // <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                          <TokenPage
                            address={match.params.tokenAddress.toLowerCase()}
                          />
                          // </LayoutWrapper>
                        );
                      } else {
                        return <Redirect to="/" />;
                      }
                    }}
                  />

                  <Route
                    exacts
                    strict
                    path="/pair/:pairAddress"
                    render={({ match }) => {
                      if (
                        isAddress(match.params.pairAddress.toLowerCase()) &&
                        !Object.keys(PAIR_BLACKLIST).includes(
                          match.params.pairAddress.toLowerCase()
                        )
                      ) {
                        return (
                          // <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                          <PoolDetail
                            pairAddress={match.params.pairAddress.toLowerCase()}
                          />
                          // </LayoutWrapper>
                        );
                      } else {
                        return <Redirect to="/" />;
                      }
                    }}
                  />
                </Switch>
              </BrowserRouter>
            </div>
            <div className={classes.footer}>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </Web3ReactProvider>
    </Provider>
  );
}

export default App;
