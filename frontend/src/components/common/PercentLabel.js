import { makeStyles } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import BigNumber from "bignumber.js";

const useStyles = makeStyles((theme) => ({
  statPercentageGreen: {
    color: "#4caf50",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  statPercentageRed: {
    color: "#ff1744",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  arrowIcon: {
    margin: 0,
    padding: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  label: {
    display: "inline-flex",
    alignItems: "center",
  },
}));

const PercentLabel = ({ percentValue, className, braces = false }) => {
  const ownClasses = useStyles();

  const formatPercentValue = (value) => {
    const _value = !value ? new BigNumber(0) : new BigNumber(value)
    if (_value.gt(1)) {
      return _value.toFixed(2).toString();
    }
    return _value.toFixed(3).toString();
  };
  return (
    <div
      className={[
        percentValue >= 0
          ? ownClasses.statPercentageGreen
          : ownClasses.statPercentageRed,
        className,
      ].join(" ")}
    >
      {!percentValue ? <span className={ownClasses.label}>0%</span> : (<span className={ownClasses.label}>
        {!braces || "("}
        {percentValue >= 0 ? (
          <ArrowUpwardIcon
            fontSize="small"
            className={[ownClasses.arrowIcon, className].join(" ")}
          />
        ) : (
          <ArrowDownwardIcon
            fontSize="small"
            className={[ownClasses.arrowIcon, className].join(" ")}
          />
        )}
        {formatPercentValue(percentValue)}%{!braces || ")"}
      </span>)}

    </div>
  );
};

export default PercentLabel;
