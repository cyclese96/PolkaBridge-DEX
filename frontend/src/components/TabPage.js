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

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 15,
    padding: 7,
    display: "flex",
    width: 300,
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
  },
  default_tabStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: 3,
    paddingLeft: 15,
    paddingRight: 15,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 7,
    "&:hover": {
      background: "#e5e5e5",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 30,
      paddingRight: 30,
    },
  },
  active_tabStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: 3,
    paddingLeft: 15,
    paddingRight: 15,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 7,
    "&:hover": {
      background: "#e5e5e5",
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

export default function TabPage() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className={classes.tabs}>
        <div
          className={
            value === 0 ? classes.active_tabStyle : classes.default_tabStyle
          }
          onClick={() => handleChange(0)}
        >
          Swap{" "}
        </div>
        <div
          className={
            value === 1 ? classes.active_tabStyle : classes.default_tabStyle
          }
          onClick={() => handleChange(1)}
        >
          Pools{" "}
        </div>
        <div
          className={
            value === 2 ? classes.active_tabStyle : classes.default_tabStyle
          }
          onClick={() => handleChange(2)}
        >
          Charts{" "}
          <img
            src="https://cdn-icons-png.flaticon.com/512/478/478544.png"
            style={{ height: 16, marginTop: -5, marginLeft: 5 }}
          />
        </div>
      </div>
      <TabPanel value={value} index={0}>
        <SwapCard />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddLiquidity />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Analytics />
      </TabPanel>
    </>
  );
}
