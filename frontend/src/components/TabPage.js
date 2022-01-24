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
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 15,
    padding: 7,
    display: "flex",
    width: 400,
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
  },
  default_tabStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    color: theme.palette.primary.iconColor,
    padding: 3,
    paddingLeft: 15,
    paddingRight: 15,
    cursor: "pointer",
    fontWeight: 600,
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
  noDecoration: {
    textDecoration: "none",
  },
  active_tabStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: theme.palette.primary.iconBack,
    color: theme.palette.primary.iconColor,
    padding: 3,
    paddingLeft: 15,
    paddingRight: 15,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    borderRadius: 7,
    "&:hover": {
      background: "#e5e5e5",
    },
  },
}));

const TabPanel = (props) => {
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
};

const TabPage = ({ data = 1 }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.tabs}>
        <Link to="/" className={classes.noDecoration}>
          {" "}
          <div
            className={
              data === 0 ? classes.active_tabStyle : classes.default_tabStyle
            }
          >
            Swap{" "}
          </div>
        </Link>
        <Link to="/liquidity" className={classes.noDecoration}>
          <div
            className={
              data === 1 ? classes.active_tabStyle : classes.default_tabStyle
            }
          >
            Pools{" "}
          </div>
        </Link>
        <Link to="/farms" className={classes.noDecoration}>
          <div
            className={
              data === 2 ? classes.active_tabStyle : classes.default_tabStyle
            }
          >
            Farms{" "}
          </div>
        </Link>
        <Link to="/charts" className={classes.noDecoration}>
          {" "}
          <div
            className={
              data === 3 ? classes.active_tabStyle : classes.default_tabStyle
            }
          >
            Charts{" "}
            <img
              src="https://cdn-icons-png.flaticon.com/512/478/478544.png"
              style={{ height: 16, marginTop: -5, marginLeft: 5 }}
            />
          </div>
        </Link>
      </div>

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
};

export default React.memo(TabPage);
