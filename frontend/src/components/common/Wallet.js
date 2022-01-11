import { Button, makeStyles } from "@material-ui/core";
import {
  AccountBalanceWallet,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { connectWallet } from "../../actions/accountActions";
import { isMetaMaskInstalled } from "../../utils/helper";
import { useWeb3React } from "@web3-react/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    background: "transparent",
    border: "0.5px solid purple",
    color: "white",
    padding: 7,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: 20,
    fontWeight: 500,
    letterSpacing: 0.4,
    textTransform: "none",
    [theme.breakpoints.down("sm")]: {
      width: 140,
    },
  },
  navbarButton: {
    background: "linear-gradient(to right, #C80C81,purple)",
    color: "white",
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    fontWeight: 500,
    letterSpacing: 0.4,
    textTransform: "none",
    filter: "drop-shadow(0 0 0.5rem #414141)",
    "&:hover": {
      background: "#C80C81",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginLeft: 15,
      width: 150,
    },
  },
  numbers: {
    color: "#eeeeee",
    fontSize: 14,
  },
}));

const Wallet = ({

  onWalletClick,
  account: { connected, currentNetwork, currentAccount },
}) => {
  const classes = useStyles();
  const { active, account } = useWeb3React();

  // const handleConnectWallet = async () => {
  //   if (!isMetaMaskInstalled()) {
  //     alert("Please install MetaMask to connect!");
  //     return;
  //   }
  //   await connectWallet(true, currentNetwork);
  // };

  return (
    <div>
      {!active ? (
        <Button
          onClick={onWalletClick}
          className={classes.navbarButton}
          variant="contained"
        >
          Connect Wallet
        </Button>
      ) : (
        <Button onClick={onWalletClick} className={classes.root}>
          <AccountBalanceWallet
            style={{ color: "#bdbdbd", marginRight: 5, fontSize: 20 }}
            fontSize="medium"
          />
          <strong className={classes.numbers}>
            {account ? <span></span> : "..."}
            {[...account?.toString()]?.splice(0, 3)}
            {"..."}
            {[...account?.toString()]?.splice(
              [...account?.toString()]?.length - 4,
              4
            )}
          </strong>
        </Button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { connectWallet })(Wallet);
