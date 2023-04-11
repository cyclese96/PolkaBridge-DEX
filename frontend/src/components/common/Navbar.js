import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import PeopleAltOutlined from "@material-ui/icons/PeopleAltOutlined";
import TouchAppOutlined from "@material-ui/icons/TouchAppOutlined";
import SwapVertIcon from "@material-ui/icons/SwapVert";

import { EqualizerOutlined, MoreVert } from "@material-ui/icons";
import Wallet from "./Wallet";
import DotCircle from "./DotCircle";
import { connect, useDispatch } from "react-redux";
import NetworkSelect from "./NetworkSelect";
import { loadTokens } from "../../actions/dexActions";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { Divider } from "@material-ui/core";

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
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
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
    width: "100%",

    borderTop: `5px solid #E0077D`,
    // borderColor: "#3A1242",
    height: "100%",
    // backgroundColor: theme.palette.primary.iconBack,
    color: theme.palette.primary.iconColor,
  },
}));

const Navbar = ({ account: { currentChain } }) => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "bottom" || anchor === "bottom",
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
          { name: "P2P", link: "https://p2p.polkabridge.org/", id: "p2p", icon: <PeopleAltOutlined /> },
        ].map((tab, index) => (
          <ListItem button key={tab.name} onClick={toggleDrawer(anchor, false)}>
            <a href={tab.link}>
              <ListItemText
                primary={tab.name}
                className={classes.menuTitleMobile}
              />
            </a>
            <Divider />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const { account, chainId } = useActiveWeb3React();
  // const currentChain = useSelector((state) => state.account?.currentChain);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentChain) {
      return;
    }
    dispatch(loadTokens(currentChain));
  }, [dispatch, currentChain]);

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const cachedChain = localStorage.getItem("cachedChain");

    // console.log("chain changed ", { chainId, cachedChain });
    if (cachedChain && chainId?.toString() !== cachedChain) {
      localStorage.setItem("cachedChain", chainId?.toString());

      window?.location.reload();
    } else if (!cachedChain) {
      localStorage.setItem("cachedChain", chainId?.toString());
    }
  }, [chainId, account]);

  useEffect(() => {
    if (!account) {
      return;
    }
    const cachedAccount = localStorage.getItem("cachedAccount");

    // console.log("chain changed ", { account, cachedAccount });
    if (cachedAccount && account?.toString() !== cachedAccount) {
      localStorage.setItem("cachedAccount", account?.toString());

      window?.location.reload();
    } else if (!cachedAccount) {
      localStorage.setItem("cachedAccount", account?.toString());
    }
  }, [account]);

  return (
    <div className={classes.grow}>
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
            <a
              href="https://p2p.polkabridge.org"
              target="_blank"
              rel="noreferrer"
              className={classes.navbarItemsDesktop}
            >
              P2P <DotCircle />
            </a>
          </div>

          <div className={classes.grow} />

          <NetworkSelect />
          <Wallet />
        </Toolbar>

        <Toolbar className={classes.sectionMobile}>
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

          <div className=" d-flex  align-items-center">
            <NetworkSelect />
            <Wallet />
            {["bottom"].map((anchor) => (
              <React.Fragment key={anchor}>
                <IconButton
                  aria-label="More"
                  aria-haspopup="true"
                  className={classes.menuIcon}
                  onClick={toggleDrawer(anchor, true)}
                >
                  <MoreVert className={classes.menuIcon} />
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
