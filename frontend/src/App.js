import "./App.css";
import React, { Suspense, lazy } from "react";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import theme from "./theme";

import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { PAIR_BLACKLIST, TOKEN_BLACKLIST } from "./constants";
import { isAddress } from "utils/contractUtils";
import Loader from "components/common/Loader";

const TokenPage = lazy(() =>
  import("./components/pages/Analytics/components/DetailsPage/TokenDetail")
);
const Swap = lazy(() => import("./components/pages/Swap"));
const AddLiquidity = lazy(() => import("./components/pages/AddLiquidity"));
const PoolDetail = lazy(() =>
  import("./components/pages/Analytics/components/DetailsPage/PoolDetail")
);
const Analytics = lazy(() => import("./components/pages/Analytics/Analytics"));
const AllTopToken = lazy(() =>
  import("./components/pages/Analytics/components/Tables/AllTopToken")
);
const AllTopPool = lazy(() =>
  import("./components/pages/Analytics/components/Tables/AllTopPool")
);
const Navbar = lazy(() => import("./components/common/Navbar"));
const Footer = lazy(() => import("./components/common/Footer"));
const Farms = lazy(() => import("./components/pages/Farms"));

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
  fallbackLoader: {
    minHeight: `calc(100vh - 120px)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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

function App() {
  const classes = useStyles();
  return (
    <Suspense
      fallback={
        <div className={classes.fallbackLoader}>
          <Loader />{" "}
        </div>
      }
    >
      <ThemeProvider theme={theme}>
        <div style={{ overflowX: "hidden" }}>
          <div className={classes.navbar}>
            <Navbar />
          </div>
          <div className={classes.mainContent}>
            <BrowserRouter>
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
    </Suspense>
  );
}

export default App;
