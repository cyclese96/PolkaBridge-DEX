import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { useSelector } from "react-redux";
import { switchChain } from "../../connection/switchChain";
import { SupportedChainId } from "../../connection/chains";

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
    fontSize: 12,
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
  // const [network, setNetwork] = React.useState(null);

  const { connector } = useActiveWeb3React();
  const selectedChain = useSelector((state) => state.account?.currentChain);

  const handleChange = useCallback(
    async (_selected) => {
      if (selectedChain === _selected) {
        console.log("switch test returned ", {
          _selected,
          selectedChain,
        });
        return;
      }

      localStorage.setItem("currentNetwork", _selected);

      // handleChangeNetwork(_selected);

      try {
        const switchRes = await switchChain(connector, _selected);
        console.log("switch test activating  chain switch failed ", switchRes);
      } catch (error) {
        console.log("switch test activating  chain switch failed ", error);
      }
    },
    [connector, selectedChain]
  );

  return (
    <div>
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
            value={SupportedChainId.MAINNET}
            className={classes.buttonDrop}
          >
            <span>Ethereum</span>
            <img
              className={classes.imgIcon}
              src="https://swap.polkabridge.org/img/eth.png"
              alt="Ethereum"
            />
          </MenuItem>
          <MenuItem value={SupportedChainId.BSC} className={classes.buttonDrop}>
            <span>BSC</span>
            <img
              className={classes.imgIcon}
              alt={"BSC"}
              src="https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313"
            />
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
