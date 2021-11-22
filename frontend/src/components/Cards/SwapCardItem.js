import { Card, CircularProgress, makeStyles } from "@material-ui/core";
import { fromWei, isNumber } from "../../utils/helper";
import { connect } from "react-redux";
import SelectToken from "../common/SelectToken";
import { formatCurrency } from "../../utils/formatters";
import { useTokenData, useTokenDataContext } from "../../contexts/TokenData";
import { formattedNum } from "../../utils/timeUtils";
import BigNumber from "bignumber.js";
import { tokenAddresses } from "../../constants";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 440,
    height: 120,
    background: ` linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.02)
    )`,
    border: "1px solid #414141",

    borderRadius: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: "96%",
      height: 110,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",

    padding: 10,
    [theme.breakpoints.down("sm")]: {
      padding: 5,
    },
  },
  labelFont: {
    fontSize: 14,
    color: "#e5e5e5",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  hintLabelFont: {
    fontSize: 14,
    color: "#a0a0a0",
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

    display: "flex",
    width: "95%",
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
    fontSize: 22,
    color: "white",
    maxWidth: 200,
    outline: "none",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 150,
      fontSize: 24,
    },
  },
  token: {
    display: "flex",
    alignItems: "center",
    border: "0.5px solid white",
    borderRadius: 12,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    height: 30,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  tokenIcon: {
    width: 25,
    height: "auto",
    marginRight: 2,
  },
  maxButton: {
    color: "white",
    cursor: "pointer",
    backgroundColor: "rgba(223, 9, 124,0.5)",
    borderRadius: 7,
    padding: "1px 5px 1px 5px",
    marginLeft: 2,
    marginRight: 7,
    fontSize: 15,

    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
}));

const SwapCardItem = (props) => {
  const {
    account: { balance, loading },
    inputType,
    onInputChange,
    onTokenChange,
    currentToken,
    inputValue,
    disableToken,
    priceUSD
  } = props;
  const classes = useStyles();

  const handleInputChange = (event) => {
    if (
      !isNumber(event.nativeEvent.data) &&
      event.nativeEvent.inputType !== "deleteContentBackward"
    ) {
      return;
    }

    const value = event.target.value;
    onInputChange(value);
  };
  // const [state, { update }] = useTokenDataContext()
  // const tokenData = state?.[currentToken.address]

  // useEffect(() => {
  //   if (!tokenDataFetched) {
  //     return
  //   }
  //   setTokenData(tokenDataFetched)
  //   // return () => {
  //   //   cleanup
  //   // }
  // }, [tokenDataFetched, currentToken])

  // console.log('tokenData', { currTokenData: tokenData })

  const handleMax = () => {

    if (!currentToken.symbol) {
      return
    }

    onInputChange(
      balance
        ? fromWei(balance[currentToken.symbol], currentToken.decimals)
        : "0"
    );
  };

  return (
    <>
      <Card elevation={1} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.labelRow}>
            {inputType ? (
              <p className={classes.labelFont} hidden={inputType === null}>
                {inputType === "from" ? "From:" : "To:"}
              </p>
            ) : (
              ""
            )}
            <p className={classes.labelFont}>
              Balance:
              {formatCurrency(
                fromWei(balance[currentToken.symbol], currentToken.decimals)
              )}
            </p>
          </div>
          <div className={classes.inputRow}>
            <input
              type="text"
              className={classes.input}
              onChange={handleInputChange}
              value={inputValue}
              placeholder="0.0"
            />

            <div className="d-flex align-items-center">
              <span className={classes.maxButton} onClick={handleMax}>
                Max
              </span>
              <SelectToken
                selectedToken={currentToken}
                disableToken={disableToken}
                handleTokenSelected={onTokenChange}
              />
            </div>
          </div>
          {new BigNumber(inputValue).gt(0) && (
            <div className={classes.labelRow}>
              {/* <p className={classes.hintLabelFont}>~ $ {priceUSD?.priceUSD} {inputValue && formattedNum(new BigNumber(inputValue).multipliedBy(priceUSD).toString())}</p> */}
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(SwapCardItem);
