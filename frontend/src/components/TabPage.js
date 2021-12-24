import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Swap from "./pages/Swap";
import AddLiquidity from "./pages/AddLiquidity";
import Analytics from "./pages/Analytics/Analytics";
import { Link } from "react-router-dom";

import Farms from "./pages/Farms/Farms";

const useStyles = makeStyles((theme) => ({
  tabs: {
    paddingTop: 10,
  },
  default_tabStyle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  active_tabStyle: {
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 7,
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
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

export default function TabPage({ data = 1 }) {
  const classes = useStyles();

  return (
    <>
      <Tabs
        value={data}
        TabIndicatorProps={{
          style: {
            backgroundColor: "#E0077D",
          },
        }}
        centered
        className={classes.tabs}
      >
        <Link to="/">
          <Tab
            className={
              data === 0 ? classes.active_tabStyle : classes.default_tabStyle
            }
            label="Swap"
          />
        </Link>
        <Link to="/liquidity">
          <Tab
            className={
              data === 1 ? classes.active_tabStyle : classes.default_tabStyle
            }
            label="Pools"
          />

        </Link>
        <Link to="/farms">
          <Tab
            className={
              data === 2 ? classes.active_tabStyle : classes.default_tabStyle
            }
            label="Farms"
          />
        </Link>
        <Link to="/charts">
          <Tab
            className={
              data === 3 ? classes.active_tabStyle : classes.default_tabStyle
            }
            label="Charts"
          />
        </Link>
      </Tabs>

      <TabPanel data={0} index={0}>
        <Swap />
      </TabPanel>
      <TabPanel data={1} index={1}>
        <AddLiquidity />
      </TabPanel>

      <TabPanel data={2} index={2}>
        <Farms />
      </TabPanel>
      <TabPanel data={3} index={3}>

        <Analytics />
      </TabPanel>

    </>
  );
}
