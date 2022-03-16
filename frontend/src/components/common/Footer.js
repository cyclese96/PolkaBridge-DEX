import { makeStyles } from "@material-ui/core";
import { FACTORY_ADDRESS } from "constants/index";
import React from "react";
import { urls } from "utils/formatters";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 13,
    color: theme.palette.primary.iconColor,
    [theme.breakpoints.down("sm")]: {
      fontSize: 9,
      marginLeft: 5,
      marginRight: 5,
    },
  },
  ankrLabel: {
    textAlign: "center",
    color: theme.palette.primary.iconColor,
    fontSize: 12,
    paddingTop: 3,
    marginLeft: 10,
    // marginBottom: 4,
  },
  icon: {
    width: 25,
    height: "100%",
    marginRight: 10,
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <a
        className={classes.item}
        href={urls.showAddress(FACTORY_ADDRESS[1])}
        target="_blank"
        rel="noreferrer"
      >
        Contract
      </a>
      <a
        className={classes.item}
        href="https://github.com/cyclese96"
        target="_blank"
        rel="noreferrer"
      >
        Github
      </a>
      <a
        className={classes.item}
        href="https://twitter.com/realpolkabridge"
        target="_blank"
        rel="noreferrer"
      >
        Twitter
      </a>
      <a
        className={classes.item}
        href="https://t.me/polkabridgegroup"
        target="_blank"
        rel="noreferrer"
      >
        Telegram
      </a>
      <a
        className={classes.item}
        href="https://discord.gg/tzemFksyZB"
        target="_blank"
        rel="noreferrer"
      >
        Discord
      </a>
      <a
        className={classes.item}
        href="https://polkabridge.org"
        target="_blank"
        rel="noreferrer"
      >
        Landing Page
      </a>

      <div className={classes.ankrLabel}>
        <img
          src="https://assets.coingecko.com/coins/images/4324/small/U85xTl2.png?1608111978"
          alt="Ankr"
          className={classes.icon}
        />
        RPC powered by ANKR protocol
      </div>
    </div>
  );
};

export default React.memo(Footer);
