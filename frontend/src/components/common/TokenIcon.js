import { makeStyles } from "@material-ui/core";
import React from "react";
import { isAddress } from "utils/contractUtils";
import { currentConnection } from "../../constants/index";
import tokenThumbnail from "../../utils/tokenThumbnail";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    height: 20,
    borderRadius: "50%",
    marginRight: 5,
  },
}));

const TokenIcon = ({ symbol, styles, className, address, size }) => {
  const ownClasses = useStyles();
  const path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${isAddress(
    address
  )}/logo.png`;

  const _path =
    currentConnection === "testnet"
      ? !symbol
        ? path
        : tokenThumbnail(symbol)
      : path;

  return (
    <img
      className={[ownClasses.root, className, styles].join(" ")}
      src={_path}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = tokenThumbnail(symbol ? symbol : "");
      }}
      alt={""}
      style={{ height: size }}
    />
  );
};

export default React.memo(TokenIcon);
