import { Card, CircularProgress, makeStyles } from "@material-ui/core";
import { fromWei, formatCurrency } from "../../utils/helper";
import { connect } from "react-redux";
import SelectToken from "../common/SelectToken";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 440,
    height: 100,
    background: "white",
    border: "0.5px solid rgba(224, 224, 224,0.6)",

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
    color: "rgba(86, 90, 105,0.8)",
    fontWeight: 500,
    fontFamily: "Roboto",

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
    color: "#212121",
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
    fontSize: 23,
    fontWeight: 600,
    color: "#454545",
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
    color: "#0000000",
    cursor: "pointer",
    background: "rgba(224, 1, 125, 0.1)",
    borderRadius: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 2,
    marginRight: 4,
    fontSize: 14,
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
    const value = event.target.value;
    onInputChange(value);
  };

  const handleMax = () => {
    onInputChange(balance ? fromWei(balance[currentToken.symbol]) : "0");
  };

  return (
    <>
      <Card elevation={0} className={classes.card}>
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
            {inputType === "from" && (
              <span className={classes.maxButton} onClick={handleMax}>
                MAX
              </span>
            )}

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
