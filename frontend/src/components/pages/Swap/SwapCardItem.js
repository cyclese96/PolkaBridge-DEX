import { Card, makeStyles } from "@material-ui/core";
import SelectToken from "../../common/SelectToken";
import { formatCurrency } from "../../../utils/formatters";
import { formattedNum } from "../../../utils/timeUtils";
import BigNumber from "bignumber.js";
import React from "react";
import NumberInput from "components/common/NumberInput";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 440,
    height: "100%",
    minHeight: 100,
    backgroundColor: theme.palette.primary.bgCard,
    border: "0.5px solid rgba(224, 224, 224,0.6)",

    borderRadius: 15,
    paddingBottom: 0,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: "95%",
      height: 80,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",

    padding: 10,
    paddingBottom: 0,
    [theme.breakpoints.down("sm")]: {
      padding: 5,
    },
  },
  labelFont: {
    fontSize: 14,
    color: theme.palette.textColors.heading,

    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  hintLabelFont: {
    fontSize: 11,
    color: theme.palette.textColors.light,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  labelRow: {
    display: "flex",
    width: "95%",
    justifyContent: "space-between",
  },
  inputRow: {
    padding: 0,
    width: "95%",
    display: "flex",

    paddingBottom: 0,
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      marginTop: -10,
      width: "100%",
    },
  },
  input: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    fontSize: 20,
    fontWeight: 500,
    color: theme.palette.textColors.heading,
    maxWidth: 150,
    outline: "none",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 150,
      fontSize: 24,
    },
  },
  maxButton: {
    color: theme.palette.textColors.pbr,
    cursor: "pointer",

    borderRadius: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 2,
    marginRight: 4,
    fontSize: 13,
    "&:hover": {
      background: "rgba(224, 1, 125, 0.2)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
}));

const SwapCardItem = (props) => {
  const {
    inputType,
    onInputChange,
    onTokenChange,
    currentToken,
    inputValue,
    disableToken,
    priceUSD,
    currenryBalance,
  } = props;
  const classes = useStyles();

  const handleMax = () => {
    if (!currentToken.address || !currenryBalance) {
      return;
    }

    onInputChange(!currenryBalance ? "0" : currenryBalance);
  };

  return (
    <>
      <Card elevation={0} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.labelRow}>
            {inputType ? (
              <p className={classes.labelFont} hidden={inputType === null}>
                {inputType === "from" ? "From:" : "To (estimate):"}
              </p>
            ) : (
              ""
            )}
            <p className={classes.labelFont}>
              Balance:
              {formatCurrency(!currenryBalance ? "0" : currenryBalance)}
            </p>
          </div>
          <div className={classes.inputRow}>
            <NumberInput
              style={classes.input}
              onInputChange={onInputChange}
              value={inputValue}
            />

            <div className="d-flex align-items-center">
              <span className={classes.maxButton} onClick={handleMax}>
                MAX
              </span>
              <SelectToken
                selectedToken={currentToken}
                disableToken={disableToken}
                handleTokenSelected={onTokenChange}
              />
            </div>
          </div>
          {new BigNumber(priceUSD).gt(0) && inputType === "to" && (
            <div className={classes.labelRow}>
              <p className={classes.hintLabelFont}>
                ~ $
                {formattedNum(
                  new BigNumber(inputValue).gt(0)
                    ? new BigNumber(inputValue)
                        .multipliedBy(priceUSD)
                        .toString()
                    : priceUSD
                )}
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default React.memo(SwapCardItem);
