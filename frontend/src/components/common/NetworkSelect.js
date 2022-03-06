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
import { currentConnection } from "../../constants/index";
import config from "../../utils/config";
import { Button } from "@material-ui/core";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";

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
export default function NetworkSelect({ selectedNetwork }) {
  const classes = useStyles();
  const [network, setNetwork] = React.useState(
    parseInt(localStorage.getItem("currentNetwork") || config.chainId)
  );

  const { active, chainId } = useActiveWeb3React();

  const handleChange = useCallback(
    (_selected) => {
      if (network === _selected) {
        return;
      }

      localStorage.setItem("currentNetwork", _selected);
      setNetwork(_selected);
      if ([config, config.bscChainTestent].includes(_selected)) {
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

  useEffect(() => {
    if (!selectedNetwork) {
      return;
    }

    handleChange(selectedNetwork);
  }, [selectedNetwork, handleChange]);

  return (
    <div>
      {active &&
      ![config.ethChainId, config.ethChainIdRinkeby].includes(
        parseInt(chainId)
      ) ? (
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
            value={parseInt(selectedNetwork)}
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
                src="img/eth.png"
                alt="Ethereum"
              />
            </MenuItem>
            {/* <MenuItem
            value={
              currentConnection === "testnet"
                ? config.moonriverChainTestent
                : config.moonriverChain
            }
            className={classes.buttonDrop}
          >
            <span>Moonriver</span>
            <img className={classes.imgIcon} src="img/moon.png" />
          </MenuItem> */}
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
