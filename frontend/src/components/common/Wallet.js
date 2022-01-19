import { Button, makeStyles } from "@material-ui/core";
import { AccountBalanceWalletOutlined } from "@material-ui/icons";
import { connect } from "react-redux";
import { connectWallet } from "../../actions/accountActions";
import { isMetaMaskInstalled } from "../../utils/helper";

const useStyles = makeStyles((theme) => ({
  walletConnected: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    borderRadius: 15,
    padding: 6,
    paddingLeft: 15,
    paddingRight: 15,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(224, 208, 217,1)",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 30,
      paddingRight: 30,
    },
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
  },
  navbarButton: {
    backgroundColor: "#f9f9f9",
    color: "#C80C81",
    borderRadius: 10,
    height: 35,
    marginRight: 40,
    padding: 15,
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
  account: {
    color: "#000000",
    fontSize: 15,
  },
}));

const Wallet = ({
  connectWallet,
  onWalletClick,
  account: { connected, currentNetwork, currentAccount },
}) => {
  const classes = useStyles();

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert("Please install Meta Mask to connect");
      return;
    }
    await connectWallet(true, currentNetwork);
  };

  return (
    <div>
      {!connected ? (
        <Button onClick={handleConnectWallet} className={classes.navbarButton}>
          Unlock Wallet
        </Button>
      ) : (
        <div onClick={onWalletClick} className={classes.walletConnected}>
          <strong className={classes.account}>
            {currentAccount ? (
              <span>
                {currentAccount.toString().slice(0, 4)} ...
                {currentAccount.substr(currentAccount.length - 6)}
              </span>
            ) : (
              "."
            )}
          </strong>
          <img
            src="https://cdn-icons.flaticon.com/png/512/4825/premium/4825181.png?token=exp=1642571217~hmac=da1764858b8fd01e78e25568a85228a5"
            style={{ height: 26, padding: 4, marginTop: -2 }}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { connectWallet })(Wallet);
