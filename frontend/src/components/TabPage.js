import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import SwapCard from "./Cards/SwapCard";
import AddLiquidity from "./pages/AddLiquidity";
import Analytics from "./pages/Analytics";

const useStyles = makeStyles({
  root: {
    marginBottom: 50,
  },
  default_tabStyle: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 14,
  },
  active_tabStyle: {
    fontSize: 14,
    color: "white",
  },
});

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
        className={classes.root}
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
      <TabPanel value={value} index={2} >
          <Analytics />
      </TabPanel>
    </>
  );
}
