import { makeStyles } from "@material-ui/core";
import { currentConnection } from "../../constants";
import { isAddress } from "../../utils/helper";
import tokenThumbnail from "../../utils/tokenThumbnail";

const useStyles = makeStyles((theme) => ({

  root: {
    width: "auto",
    height: 20,
    borderRadius: "50%",
  },
}));

const TokenIcon = ({ symbol, styles, className, address }) => {
  const ownClasses = useStyles();
  const path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${isAddress(address)}/logo.png`;
  // const path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695/logo.png`
  const _path = currentConnection === 'testnet' ? tokenThumbnail(symbol) : path

  return (
    <img
      className={[ownClasses.root, className, styles].join(" ")}
      src={_path}
      alt={""}
    />
  );
};

export default TokenIcon;
