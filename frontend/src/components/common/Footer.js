import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginTop: 100,
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <a className={classes.item} href="#">
        Contract
      </a>
      <a
        className={classes.item}
        href="https://github.com/cyclese96"
        target="_blank"
      >
        Github
      </a>
      <a
        className={classes.item}
        href="https://twitter.com/realpolkabridge"
        target="_blank"
      >
        Twitter
      </a>
      <a
        className={classes.item}
        href="https://t.me/polkabridgegroup"
        target="_blank"
      >
        Telegram
      </a>
      <a
        className={classes.item}
        href="https://discord.gg/G3NDrcq6GW"
        target="_blank"
      >
        Discord
      </a>
      <a
        className={classes.item}
        href="https://polkabridge.org"
        target="_blank"
      >
        Landing Page
      </a>
    </div>
  );
};

export default Footer;
