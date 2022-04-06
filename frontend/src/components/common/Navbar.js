import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleAltOutlined from "@material-ui/icons/PeopleAltOutlined";
import FlareOutlined from "@material-ui/icons/FlareOutlined";
import TouchAppOutlined from "@material-ui/icons/TouchAppOutlined";
import SwapVertIcon from "@material-ui/icons/SwapVert";

import { EqualizerOutlined } from "@material-ui/icons";
import Wallet from "./Wallet";
import AccountDialog from "./AccountDialog";
import DotCircle from "./DotCircle";
import { connect } from "react-redux";
import NetworkSelect from "./NetworkSelect";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { useWalletConnectCallback } from "utils/connectionUtils";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBarBackground: {
    boxShadow: "none",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    borderBottom: "0.5px solid #e5e5e5",
  },
  menuButton: {
    textTransform: "none",
  },
  title: {
    fontWeight: 600,
    fontSize: 22,
  },
  iconText: {
    fontSize: 15,
  },
  icon: {},

  sectionDesktop: {
    marginLeft: 40,
    marginRight: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
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
    width: "90vw",
    display: "flex",
    justifyContent: "space-between",
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

  fullList: {
    width: "auto",
  },
  menuTitleMobile: {
    paddingLeft: 25,
    fontWeight: 600,
    verticalAlign: "baseline",
    textAlign: "left",
    fontSize: 16,
    color: theme.palette.primary.iconColor,
  },
  navbarItemsDesktop: {
    paddingRight: 10,
    fontWeight: 500,
    lineHeight: "24px",
    verticalAlign: "baseline",
    letterSpacing: "-1px",
    margin: 0,
    padding: "9px 14px 0px",
    cursor: "pointer",
    fontSize: "1.05vw",
    color: theme.palette.primary.appLink,
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
    justifyContent: "space-between",
    alignItems: "center",
    // background: `linear-gradient(to bottom, rgba(224, 1, 125, 0.06), #f5f3f3)`,

    backgroundColor: theme.palette.primary.buttonColor,
    borderRadius: 14,
    padding: 6,
    paddingLeft: 8,
    paddingRight: 15,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginRight: 5,
    marginLeft: 15,

    "&:hover": {
      background: "rgba(224, 208, 217,1)",
    },
    [theme.breakpoints.down("md")]: {
      padding: 3,
      paddingLeft: 8,
      paddingRight: 8,
      height: 35,
    },
  },
  networkIcon: {
    width: "auto",
    height: 20,
    fontSize: 25,
  },
  menuIcon: {
    color: theme.palette.primary.iconColor,
  },
  logo: {
    height: 44,

    [theme.breakpoints.down("sm")]: {
      height: 30,
      width: "auto",
    },
  },
  list: {
    paddingTop: 20,
    width: "250px",
    borderLeft: "5px solid pink",
    borderColor: "#3A1242",
    height: "100%",
    backgroundColor: theme.palette.primary.iconBack,
    color: theme.palette.primary.iconColor,
  },
  networkText: {
    marginRight: 5,
    color: theme.palette.textColors.heading,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    right: false,
  });

  const [accountDialog, setAccountDialog] = useState(false);

  const [connectWallet] = useWalletConnectCallback();

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const { active, deactivate } = useActiveWeb3React();

  useEffect(() => {
    if (!active && localStorage.connected === "yes") {
      connectWallet();
    }
  }, [active, connectWallet]);

  const handleLogout = () => {
    localStorage.connected = "none";
    deactivate();
  };

  const handleWalletClick = () => {
    // console.log("active", active);
    if (active) {
      setAccountDialog(true);
    } else {
      connectWallet();
    }
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
          {
            name: "Stake",
            link: "https://stake.polkabridge.org/",
            id: "staking",
            icon: <EqualizerOutlined />,
          },
          {
            name: "Farm",
            link: "https://farm.polkabridge.org/",
            id: "intro",
            icon: <TouchAppOutlined />,
          },
          {
            name: "Launchpad",
            link: "https://launchpad.polkabridge.org/",
            id: "characters",
            icon: <PeopleAltOutlined />,
          },
          {
            name: "INO",
            link: "https://ino.polkabridge.org/",
            id: "characters",
            icon: <PeopleAltOutlined />,
          },
          { name: "Swap", link: "/", id: "items", icon: <SwapVertIcon /> },
          {
            name: "Lending",
            link: "#",
            id: "features",
            icon: <FlareOutlined />,
          },
        ].map((tab, index) => (
          <a href={tab.link}>
            <ListItem
              button
              key={tab.name}
              onClick={toggleDrawer(anchor, false)}
            >
              <ListItemText
                primary={tab.name}
                className={classes.menuTitleMobile}
              />
            </ListItem>
          </a>
        ))}

        <ListItem button style={{ paddingLeft: 5 }}>
          <Wallet onWalletClick={handleWalletClick} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.grow}>
      <AccountDialog
        open={accountDialog}
        handleLogout={handleLogout}
        handleClose={() => setAccountDialog(false)}
      />
      <AppBar
        color="transparent"
        position="fixed"
        className={classes.appBarBackground}
      >
        <Toolbar className={classes.sectionDesktop}>
          <a href="/">
            {" "}
            <img
              alt="logo"
              src="https://polkabridge.org/logo.png"
              className={classes.logo}
            />
          </a>

          <div className={classes.leftMargin} />

          <div>
            <a
              href="https://stake.polkabridge.org/"
              className={classes.navbarItemsDesktop}
            >
              Stake <DotCircle />
            </a>
          </div>
          <div>
            <a
              href="https://farm.polkabridge.org"
              target="_blank"
              rel="noreferrer"
              className={classes.navbarItemsDesktop}
            >
              Farm
              <DotCircle />
            </a>
          </div>
          <div>
            <a
              href="https://launchpad.polkabridge.org"
              target="_blank"
              rel="noreferrer"
              className={classes.navbarItemsDesktop}
            >
              Launchpad <DotCircle />
            </a>
          </div>

          <div>
            <a
              href="https://ino.polkabridge.org"
              target="_blank"
              rel="noreferrer"
              className={classes.navbarItemsDesktop}
            >
              INO <DotCircle />
            </a>
          </div>
          <div>
            <a
              href="/"
              className={classes.navbarItemsDesktop}
              style={{ color: "#DF097C" }}
            >
              Swap <DotCircle />
            </a>
          </div>

          <div>
            <a href="/" className={classes.navbarItemsDesktop}>
              Lending <DotCircle />
            </a>
          </div>

          <div className={classes.grow} />

          <NetworkSelect  />
          <Wallet onWalletClick={handleWalletClick} />
        </Toolbar>

        <Toolbar className={classes.sectionMobile}>
          <div className={classes.row1}>
            <div>
              <a href="/">
                <img
                  alt="logo"
                  variant="square"
                  src="https://polkabridge.org/logo.png"
                  className={classes.logo}
                />
              </a>
            </div>

            {/* <Wallet onWalletClick={() => setAccountDialog(true)} /> */}
            <div className="d-flex justify-content-between align-items-center">
              <NetworkSelect  />
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
      <Toolbar />{" "}
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});
export default connect(mapStateToProps, {})(React.memo(Navbar));
