import { CircularProgress, makeStyles } from "@material-ui/core";
import supply from "../../assets/supply.png";
import { fromWei, formatCurrency } from "../../utils/helper";
import biteImg from "../../assets/bite.png";
import corgibImg from "../../assets/corgi.png";
import pwarImg from "../../assets/pwar.png";
import { connect } from "react-redux";
import binanceIcon from "../../assets/binance.png";
import pbrIcon from "../../assets/balance.png";
import { useState } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SelectTokenDialog from "../common/SelectTokenDialog";
import SelectToken from "../common/SelectToken";
import etherImg from "../../assets/ether.png";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 440,
    height: 100,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 290,
      height: 100,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingLeft: 10,
    paddingRight: 10,
  },
  labelFont: {
    fontSize: 14,
  },
  labelRow: {
    display: "flex",
    width: "90%",
    justifyContent: "space-between",
  },
  inputRow: {
    display: "flex",
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 5,
    height: 33,
    borderColor: "transparent",
    fontSize: 20,
    color: "white",
    maxWidth: 200,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 100,
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
  },
}));

const SwapCardItem = ({
  account: { balance, loading },
  inputType,
  onInputChange,
  onTokenChange,
  currentToken,
  inputValue,
}) => {
  const classes = useStyles();
  // const [inputValue, setInput] = useState("");

  const handleInputChange = (event) => {
    // setInput(event.target.value);
    onInputChange(event.target.value ? parseFloat(event.target.value) : "");
  };

  const handleMax = () => {
    // setInput(balance ? balance : "0.6843");
    onInputChange(balance ? balance[currentToken.symbol] : "0");
  };

  return (
    <>
      <div className={classes.card}>
        <div className="card-item-theme">
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
                {inputType === "from" ? `Balance: ${"0.6843"}` : ""}
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

              <a className={classes.maxButton} onClick={handleMax}>
                Max
              </a>

              <SelectToken
                selectedToken={currentToken}
                handleTokenSelected={onTokenChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(SwapCardItem);
