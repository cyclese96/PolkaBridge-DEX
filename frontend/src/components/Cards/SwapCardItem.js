import { Card, CircularProgress, makeStyles } from "@material-ui/core";
import { fromWei, formatCurrency, isNumber } from "../../utils/helper";
import { connect } from "react-redux";
import SelectToken from "../common/SelectToken";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 440,
    height: 100,
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
      width: 290,
      height: 80,
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
      fontSize: 13,
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
      maxWidth: 100,
      fontSize: 18,
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
    color: "#E0077D",
    cursor: "pointer",
    marginLeft: 2,
    marginRight: 4,
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
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

  const handleMax = () => {
    onInputChange(balance ? fromWei(balance[currentToken.symbol]) : "0");
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
              {" " + formatCurrency(fromWei(balance[currentToken.symbol]))}
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
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(SwapCardItem);
