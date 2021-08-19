import { makeStyles } from "@material-ui/core";
import tokenThumbnail from "../../utils/tokenThumbnail";

const useStyles = makeStyles((theme) => ({
  iconWrapper: {
    width: 25,
    height: "auto",
    backgroundColor: "white",
  },
  root: {
    width: "auto",
    height: 22,
  },
}));

const TokenIcon = ({ symbol, styles, className }) => {
  const ownClasses = useStyles();
  return (
    <img
      className={[ownClasses.root, className, styles].join(" ")}
      src={tokenThumbnail(symbol)}
      alt={""}
    />
  );
};

export default TokenIcon;
