import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes, { func } from "prop-types";
import SwapCard from "./Cards/SwapCard";
import AddLiquidity from "./pages/AddLiquidity";
import Analytics from "./pages/Analytics";
// import { ApolloProvider } from 'react-apollo'
// import { client } from "../apollo/client";
import ApplicationContextProvider from '../contexts/Application'
import GlobalDataContextProvider from '../contexts/GlobalData'
import TokenDataContextProvider, { Updater as TokenDataContextUpdater } from '../contexts/TokenData'
import PairDataContextProvider, { Updater as PairDataContextUpdater } from '../contexts/PairData'



const useStyles = makeStyles((theme) => ({
  tabs: {
    paddingTop: 10,
  },
  default_tabStyle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
    },
  },
  active_tabStyle: {
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 7,
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


function ContextProviders({ children }) {
  return (
    <ApplicationContextProvider>
      <TokenDataContextProvider>
        <GlobalDataContextProvider>
          <PairDataContextProvider>
            {children}
          </PairDataContextProvider>
        </GlobalDataContextProvider>
      </TokenDataContextProvider>
    </ApplicationContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <TokenDataContextUpdater />
      <PairDataContextUpdater />
    </>
  )
}

export default function TabPage() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{
          style: {
            backgroundColor: "#E0077D",
          },
        }}
        centered
        className={classes.tabs}
      >
        <Tab
          className={
            value === 0 ? classes.active_tabStyle : classes.default_tabStyle
          }
          label="Swap"
        />
        <Tab
          className={
            value === 1 ? classes.active_tabStyle : classes.default_tabStyle
          }
          label="Pool"
        />
        <Tab
          className={
            value === 2 ? classes.active_tabStyle : classes.default_tabStyle
          }
          label="Charts"
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SwapCard />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddLiquidity />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* <TokenDataContextProvider></TokenDataContextProvider>
        <GlobalDataContextProvider> */}
        <ContextProviders>
          <>
            <Updaters />
            <Analytics />
          </>
        </ContextProviders>
        {/* </GlobalDataContextProvider> */}
      </TabPanel>
    </>
  );
}
