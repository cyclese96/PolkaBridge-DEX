import { makeStyles } from "@material-ui/core";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isAddress } from "utils/contractUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    height: 20,
    borderRadius: "50%",
    marginRight: 5,
  },
}));

const TokenIcon = ({ address, symbol, styles, className, size }) => {
  const ownClasses = useStyles();
  const path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${isAddress(
    address
  )}/logo.png`;

  const tokenList = useSelector((state) => state?.dex?.tokenList);

  const logoUri = useMemo(() => {
    const tokenItem = tokenList?.find(
      (item) =>
        (address && item?.address?.toLowerCase() === address?.toLowerCase()) ||
        (symbol && item?.symbol?.toLowerCase() === symbol?.toLowerCase())
    );
    if (tokenItem) {
      return tokenItem.logoURI ? tokenItem.logoURI : path;
    }
    return path;
  }, [address, symbol, tokenList, path]);

  return (
    <img
      className={[ownClasses.root, className, styles].join(" ")}
      src={logoUri}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "img/no_icon.png";
      }}
      alt={""}
      style={{ height: size }}
    />
  );
};

export default React.memo(TokenIcon);
