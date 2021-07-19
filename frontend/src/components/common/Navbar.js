import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleAltOutlined from "@material-ui/icons/PeopleAltOutlined";
import FlareOutlined from "@material-ui/icons/FlareOutlined";
import TouchAppOutlined from "@material-ui/icons/TouchAppOutlined";
import VpnLockOutlined from "@material-ui/icons/VpnLockOutlined";
import CategoryIcon from "@material-ui/icons/Category";

import CustomSnackBar from "./CustomSnackbar";
import { EqualizerOutlined } from "@material-ui/icons";
import Wallet from "./Wallet";
import AccountDialog from "./AccountDialog";
import etherIcon from "../../assets/ether.png";
import binanceIcon from "../../assets/binance.png";
import { etheriumNetwork } from "../../constants";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBarBackground: {
    boxShadow: "none",
    backgroundColor: "#070F23",
  },
  menuButton: {
    textTransform: "none",
  },
  title: {
    fontWeight: 600,
    fontSize: 24,
  },
  iconText: {
    fontSize: 15,
  },
  icon: {},

  sectionDesktop: {
    marginLeft: 150,
    marginRight: 100,
    [theme.breakpoints.down("md")]: {
      marginLeft: 5,
      marginRight: 5,
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  sectionMobile: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  row1: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },

  home: {
    "text-decoration": "none",
    color: "black",
    cursor: "pointer",
    marginRight: 5,
    marginLeft: 5,
  },
  nav: {
    marginRight: 15,
  },
  menuIcon: {
    color: "#212121",
  },
  list: {
    width: "250px",
    height: "100%",
    backgroundColor: "transparent",
    color: "#f9f9f9",
  },
  fullList: {
    width: "auto",
  },
  menuTitleMobile: {
    paddingLeft: 25,
    fontWeight: 500,
    verticalAlign: "baseline",
    fontFamily: "New Rocker, cursive",
    textAlign: "left",
    fontSize: 16,
  },
  navbarItemsDesktop: {
    paddingTop: 15,
    height: 35,
    marginLeft: 18,
    marginRight: 18,
    textTransform: "none",
    fontSize: 16,
    fontWeight: 600,
    color: "#f9f9f9",
    [theme.breakpoints.down("md")]: {
      marginLeft: 10,
      marginRight: 10,
    },
  },
  navbarButton: {
    backgroundColor: "#f9f9f9",
    color: "#C80C81",
    borderRadius: 10,
    height: 35,
    marginRight: 40,
    padding: 20,
    fontSize: 14,
    fontWeight: 700,
    textTransform: "none",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginLeft: 15,
      width: 150,
    },
  },
  mobileButton: {
    borderRadius: "50px",
    background: `linear-gradient(to bottom,#D9047C, #BF1088)`,
    lineHeight: "24px",
    verticalAlign: "baseline",
    letterSpacing: "-0.8px",
    margin: 0,
    color: "#ffffff",
    padding: "5px 15px 5px 15px",
    fontWeight: 600,
  },
  leftMargin: {
    marginLeft: 159,
    [theme.breakpoints.down("lg")]: {
      marginLeft: 100,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  network: {
    display: "flex",
    marginRight: 30,
    alignItems: "center",
    border: "0.5px solid white",
    borderRadius: 15,
    padding: 4,
    paddingLeft: 7,
    paddingRight: 7,
    // cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  networkIcon: {
    width: 30,
    height: "auto",
  },
  menuIcon: {
    color: "rgba(255, 255, 255, 0.5)",
  },
}));

const Navbar = ({ currentNetwork }) => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    right: false,
  });

  const [alertObject, showAlert] = React.useState({
    status: false,
    message: "",
  });

  const [accountDialog, setAccountDialog] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const handleClose = () => {
    showAlert({ status: false, message: "" });
  };
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[
          { name: "Staking", id: "staking", icon: <EqualizerOutlined /> },
          { name: "Farm", id: "intro", icon: <TouchAppOutlined /> },
          {
            name: "Launchpad",
            id: "characters",
            icon: <PeopleAltOutlined />,
          },
          { name: "Swap", id: "items", icon: <VpnLockOutlined /> },
          { name: "Lending", id: "features", icon: <FlareOutlined /> },
          { name: "Prediction", id: "usecase", icon: <CategoryIcon /> },
          {},
        ].map((tab, index) => (
          <ListItem button key={tab.name} onClick={toggleDrawer(anchor, false)}>
            {tab.icon}
            <ListItemText
              primary={tab.name}
              className={classes.menuTitleMobile}
            />
          </ListItem>
        ))}
      </List>
      <Divider />

      <List>
        <ListItem button style={{ marginTop: 15 }}>
          <div className={classes.network}>
            <img
              className={classes.networkIcon}
              src={currentNetwork === etheriumNetwork ? etherIcon : binanceIcon}
              alt={currentNetwork}
            />
            <span style={{ color: "white", marginLeft: 5 }}>
              {currentNetwork === etheriumNetwork
                ? "Etherium"
                : "Binance Smart Chain"}
            </span>
          </div>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.grow}>
      <CustomSnackBar
        handleClose={handleClose}
        status={alertObject.status}
        message={alertObject.message}
      />
      <AccountDialog
        open={accountDialog}
        handleClose={() => setAccountDialog(false)}
      />
      <AppBar
        color="transparent"
        position="fixed"
        className={classes.appBarBackground}
      >
        <Toolbar className={classes.sectionDesktop}>
          <Avatar
            variant="square"
            src="img/logo-white.png"
            style={{ height: 38, width: 150 }}
          />

          <div className={classes.leftMargin} />

          <a href="/" className={classes.navbarItemsDesktop}>
            Staking
          </a>

          <a
            href="https://farm.polkabridge.org"
            target="_blank"
            rel="noreferrer"
            className={classes.navbarItemsDesktop}
          >
            Farm
          </a>

          <a
            href="https://launchpad.polkabridge.org"
            target="_blank"
            className={classes.navbarItemsDesktop}
          >
            Launchpad
          </a>

          <a href="#" className={classes.navbarItemsDesktop}>
            Swap
          </a>

          <a href="#" className={classes.navbarItemsDesktop}>
            Lending
          </a>

          <a href="#" className={classes.navbarItemsDesktop}>
            Prediction
          </a>
          <a
            href="https://corgib.polkabridge.org/bet"
            className={classes.navbarItemsDesktop}
          >
            Betting
          </a>
          <div className={classes.grow} />
          <div className={classes.network}>
            <img
              className={classes.networkIcon}
              src={currentNetwork === etheriumNetwork ? etherIcon : binanceIcon}
              alt={currentNetwork}
            />
            <span style={{ color: "white", marginLeft: 5 }}>
              {currentNetwork === etheriumNetwork
                ? "Etherium"
                : "Binance Smart Chain"}
            </span>
          </div>
          <Wallet onWalletClick={() => setAccountDialog(true)} />
        </Toolbar>

        <Toolbar className={classes.sectionMobile}>
          <div className={classes.row1}>
            <div className={classes.grow} />

            <Avatar
              variant="square"
              src="img/logo-white.png"
              style={{ height: 38, width: 150 }}
            />

            <div className={classes.grow} />
            <Wallet onWalletClick={() => setAccountDialog(true)} />
            <div>
              {["right"].map((anchor) => (
                <React.Fragment key={anchor}>
                  <IconButton
                    aria-label="Menu"
                    aria-haspopup="true"
                    className={classes.menuIcon}
                    onClick={toggleDrawer(anchor, true)}
                  >
                    <MenuIcon className={classes.menuIcon} />
                  </IconButton>

                  <SwipeableDrawer
                    anchor={anchor}
                    disableSwipeToOpen={false}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    onOpen={toggleDrawer(anchor, true)}
                    classes={{ paper: classes.appBarBackground }}
                  >
                    {list(anchor)}
                  </SwipeableDrawer>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
