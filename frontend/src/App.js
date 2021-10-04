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
import makeStyles from "@material-ui/core/styles/makeStyles";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";



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
  background: {
    height: "90vh",
  },

  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      width: "100%",
    },
  },
  subheading: {
    fontSize: 16,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
    marginLeft: 5,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  logo: {
    width: 95,
    height: 95,
    marginTop: 5,
    marginBottom: 40,
    backgroundColor: "#f9f9f9",
    padding: 12,
  },
}));


function App() {


  const classes = useStyles();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>

        <div style={{ overflowX: "hidden" }}>
          <div className={classes.navbar}>
            <Navbar />
          </div>
          <div className={classes.mainContent}>
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

          </div>
          <div className={classes.footer}>
            <Footer />
          </div>
        </div>



      </ThemeProvider>
    </Provider>
  );
}

export default App;
