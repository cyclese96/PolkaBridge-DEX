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
import SwapVertIcon from "@material-ui/icons/SwapVert";

import CustomSnackBar from "./CustomSnackbar";
import { EqualizerOutlined } from "@material-ui/icons";
import Wallet from "./Wallet";
import AccountDialog from "./AccountDialog";
import etherIcon from "../../assets/ether.png";
import binanceIcon from "../../assets/binance.png";
import { etheriumNetwork } from "../../constants";
import DotCircle from "./DotCircle";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBarBackground: {
    boxShadow: "none",
    backgroundColor: "#100525",
    display: "flex",
    alignItems: "center",
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
    fontWeight: 400,
    verticalAlign: "baseline",
    textAlign: "left",
    fontSize: 16,
    color: "#eeeeee",
  },
  navbarItemsDesktop: {
    paddingRight: 10,
    fontWeight: 400,
    lineHeight: "24px",
    verticalAlign: "baseline",
    letterSpacing: "-1px",
    margin: 0,
    padding: "9px 14px 0px",
    cursor: "pointer",
    fontSize: "1.2vw",
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
    marginLeft: 20,
    marginRight: 10,
    alignItems: "center",
    border: "0.5px solid #919191",
    borderRadius: 20,
    padding: 6,
    paddingLeft: 6,
    paddingRight: 10,
    letterSpacing: 0.4,

    // cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      width: 140,
    },
  },
  networkIcon: {
    width: "auto",
    height: 25,
  },
  menuIcon: {
    color: "#bdbdbd",
    fontSize: 26,
  },
  logo: {
    height: 38,
    width: 150,
    [theme.breakpoints.down("sm")]: {
      height: 30,
      width: "fit-content",
    },
  },
  list: {
    paddingTop: 20,
    width: "250px",
    borderLeft: "5px solid pink",
    borderColor: "#3A1242",
    // borderColor: "#220c3d",
    height: "100%",
    backgroundColor: "#100525",
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
          { name: "Swap", link: "#", id: "items", icon: <SwapVertIcon /> },
          {
            name: "Lending",
            link: "#",
            id: "features",
            icon: <FlareOutlined />,
          },
          {
            name: "Prediction",
            link: "#",
            id: "usecase",
            icon: <CategoryIcon />,
          },
          {},
        ].map((tab, index) => (
          <ListItem button key={tab.name} onClick={toggleDrawer(anchor, false)}>
            <ListItemText
              primary={tab.name}
              className={classes.menuTitleMobile}
            />
          </ListItem>
        ))}
        <ListItem button>
          <div className={classes.network}>
            <img
              className={classes.networkIcon}
              src={currentNetwork === etheriumNetwork ? etherIcon : binanceIcon}
              alt={currentNetwork}
            />
            <span style={{ color: "white", marginLeft: 5 }}>
              {currentNetwork === etheriumNetwork ? "Ethereum" : "BSC"}
            </span>
          </div>
        </ListItem>
        <ListItem button style={{ paddingLeft: 35 }}>
          <Wallet onWalletClick={() => setAccountDialog(true)} />
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
            className={classes.logo}
          />

          <div className={classes.leftMargin} />

          <div>
            <a href="/" className={classes.navbarItemsDesktop}>
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
              className={classes.navbarItemsDesktop}
            >
              Launchpad <DotCircle />
            </a>
          </div>
          <div>
            <a href="#" className={classes.navbarItemsDesktop}>
              Swap <DotCircle />
            </a>
          </div>

          <div>
            <a href="#" className={classes.navbarItemsDesktop}>
              Lending <DotCircle />
            </a>
          </div>

          <div>
            <a href="#" className={classes.navbarItemsDesktop}>
              Prediction <DotCircle />
            </a>
          </div>

          <div>
            <a
              href="https://corgib.polkabridge.org/bet"
              className={classes.navbarItemsDesktop}
            >
              Betting <DotCircle />
            </a>
          </div>

          <div className={classes.grow} />
          <div className={classes.network}>
            <img
              className={classes.networkIcon}
              src={currentNetwork === etheriumNetwork ? etherIcon : binanceIcon}
              alt={currentNetwork}
            />
            <span style={{ color: "#eeeeee", marginLeft: 5 }}>
              {currentNetwork === etheriumNetwork ? "Ethereum" : "BSC"}
            </span>
          </div>
          <Wallet onWalletClick={() => setAccountDialog(true)} />
        </Toolbar>

        <Toolbar className={classes.sectionMobile}>
          <div className={classes.row1}>
            <div>
              <Avatar
                variant="square"
                src="img/logo-white.png"
                className={classes.logo}
              />
            </div>

            {/* <Wallet onWalletClick={() => setAccountDialog(true)} /> */}
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
      <Toolbar />{" "}
    </div>
  );
};

export default Navbar;
