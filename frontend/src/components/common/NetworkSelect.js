import React, { useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  bscNetworkDetail,
  ethereumNetworkDetail,
  harmonyNetworkDetail,
  moonriverNetworkDetail,
  polygonNetworkDetail,
} from "../../utils/networkConstants";
import { setupNetwork } from "../../utils/connectionUtils";
import { currentConnection, FACTORY_ADDRESS } from "../../constants/index";
import config from "../../utils/config";
import { Button } from "@material-ui/core";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { useSelector } from "react-redux";
import { getCurrentNetworkName, isMetaMaskInstalled } from "../../utils/helper";
import store from "../../store";
import { CHANGE_NETWORK } from "../../actions/types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
  },
  imgIcon: {
    marginLeft: 10,
    height: 23,
  },
  buttonDrop: {
    display: "flex",
    justifyContent: "space-between",
    color: "black",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "grey",
      color: "#100525",
    },
  },
  main: {
    backgroundColor: "#f9f9f9",
    color: "#C80C81",
    textTransform: "none",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.7)",
    },
    fontSize: 14,
    fontWeight: 700,
    border: "1px solid rgba(224, 7, 125, 0.7)",
    borderRadius: 60,
    paddingLeft: 15,
    height: 40,
    width: "full-width",
    marginRight: 7,
    paddingTop: 3,
  },
}));
export default function NetworkSelect() {
  const classes = useStyles();
  const [network, setNetwork] = React.useState(
    parseInt(localStorage.getItem("currentNetwork") || config.chainId)
  );

  const { active, chainId, account } = useActiveWeb3React();
  const selectedChain = useSelector((state) => state.account?.currentChain);

  useEffect(() => {
    if (!selectedChain) {
      return;
    }

    setNetwork(selectedChain);
  }, [selectedChain]);

  const handleChangeNetwork = (_selected) => {
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: {
        network: getCurrentNetworkName(_selected),
        chain: _selected,
      },
    });
    setNetwork(_selected);
  };

  const handleChange = useCallback(
    (_selected) => {
      if (network === _selected) {
        return;
      }

      localStorage.setItem("currentNetwork", _selected);

      // handle network stated when metamask in not available
      if (!active) {
        handleChangeNetwork(_selected);
      }

      setNetwork(_selected);
      if ([config.bscChain, config.bscChainTestent].includes(_selected)) {
        setupNetwork(
          currentConnection === "mainnet"
            ? bscNetworkDetail.mainnet
            : bscNetworkDetail.testnet
        );
      } else if (
        [config.polygon_chain_mainnet, config.polygon_chain_testnet].includes(
          _selected
        )
      ) {
        setupNetwork(
          currentConnection === "mainnet"
            ? polygonNetworkDetail.mainnet
            : polygonNetworkDetail.testnet
        );
      } else if (
        [config.hmyChainMainnet, config.hmyChainTestnet].includes(_selected)
      ) {
        setupNetwork(
          currentConnection === "mainnet"
            ? harmonyNetworkDetail.mainnet
            : harmonyNetworkDetail.testnet
        );
      } else if (
        [config.moonriverChain, config.moonriverChainTestent].includes(
          _selected
        )
      ) {
        setupNetwork(
          currentConnection === "mainnet"
            ? moonriverNetworkDetail.mainnet
            : moonriverNetworkDetail.testnet
        );
      } else {
        setupNetwork(
          currentConnection === "mainnet"
            ? ethereumNetworkDetail.mainnet
            : ethereumNetworkDetail.testnet
        );
      }
    },
    [network]
  );

  return (
    <div>
      {active && !Object.keys(FACTORY_ADDRESS).includes(chainId?.toString()) ? (
        <Button
          onClick={() =>
            handleChange(
              currentConnection === "testnet"
                ? config.ethChainIdRinkeby
                : config.ethChainId
            )
          }
          className={classes.main}
        >
          Switch to ethereum
        </Button>
      ) : (
        <FormControl className={classes.root}>
          <Select
            className={classes.main}
            value={parseInt(selectedChain)}
            disableUnderline={true}
            notched={true}
            id="adornment-weight"
            onChange={({ target: { value } }) => handleChange(value)}
          >
            <MenuItem
              value={
                currentConnection === "testnet"
                  ? config.ethChainIdRinkeby
                  : config.ethChainId
              }
              className={classes.buttonDrop}
            >
              <span>Ethereum</span>
              <img
                className={classes.imgIcon}
                src="https://swap.polkabridge.org/img/eth.png"
                alt="Ethereum"
              />
            </MenuItem>
            <MenuItem
              value={
                currentConnection === "testnet"
                  ? config.bscChainTestent
                  : config.bscChain
              }
              className={classes.buttonDrop}
            >
              <span>BSC</span>
              <img
                className={classes.imgIcon}
                src="https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313"
              />
            </MenuItem>
            {/* <MenuItem
            value={
              currentConnection === "testnet"
                ? config.bscChainTestent
                : config.bscChain
            }
            className={classes.buttonDrop}
          >
            <span>Binance Smart Chain</span>
            <img className={classes.imgIcon} src={binanceIcon} />
          </MenuItem> */}
            {/* <MenuItem
            value={
              currentConnection === "testnet"
                ? config.polygon_chain_testnet
                : config.polygon_chain_mainnet
            }
            className={classes.buttonDrop}
          >
            <span>Polygon</span>
            <img className={classes.imgIcon} src={polygonIcon} />
          </MenuItem> */}
            {/* <MenuItem
            value={
              currentConnection === "testnet"
                ? config.hmyChainTestnet
                : config.hmyChainMainnet
            }
            className={classes.buttonDrop}
          >
            <span>Harmony</span>
            <img className={classes.imgIcon} src={harmonyIcon} />
          </MenuItem> */}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
