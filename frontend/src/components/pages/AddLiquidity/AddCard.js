import { makeStyles } from "@material-ui/core";

import { connect } from "react-redux";
import TuneIcon from "@material-ui/icons/Tune";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useState } from "react";
import SwapSettings from "../../common/SwapSettings";
import SelectToken from "../../common/SelectToken";
import etherImg from "../../../assets/ether.png";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { height } from "@material-ui/system";
import CustomButton from "../../Buttons/CustomButton";
import SwapCardItem from "../../Cards/SwapCardItem";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    // height: 300,
    // paddingLeft: 10,
    // paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
      //   height: 280,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // padding: 15,
    width: "100%",
    // height: "100%",
    // paddingTop: 3,
    // paddingLeft:20,
    // paddingRight:20
  },
  avatar: {
    zIndex: 2,
    position: "relative",
    width: "auto",
    height: 60,
  },
  avatar_corgib: {
    zIndex: 2,
    width: "auto",
    height: 160,
  },
  cardHeading: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 2,
  },
  cardSubHeading: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 2,
  },
  settingIcon: {
    color: "#f6f6f6",
    cursor: "pointer",
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  tokenPair: {
    display: "flex",
    width: "94%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
    // border: "1px solid white",
  },
  selectToken: {
    width: 150,
  },
  checkIcon: {
    color: "#E0077D",
  },
  selectPoolContainer: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 10,
  },
  feeSelectContainer: {
    width: 140,
    // height: 20,
    padding: 6,
    marginLeft: 5,
    marginRight: 5,
    border: "0.5px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    // cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  feeSelectHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  priceRangeCardContainer: {
    display: "flex",
    width: "90%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
  },
  feeSelectHeadingP: {
    fontSize: 14,
  },
  feeSelectHeadingSpan: {
    fontSize: 12,
  },
  depositCardsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "85%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
  },
  addButton: {
    height: 45,
    width: "80%",
    marginTop: 10,
    marginBottom: 10,
  },
  clearButton: {
    color: "#E0077D",
    cursor: "pointer",
  },
}));

const AddCard = ({ account: { balance, loading }, tokenType, handleBack }) => {
  const currentDefaultToken = {
    icon: etherImg,
    name: "Ethereum",
    symbol: "ETH",
  };
  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState(currentDefaultToken);
  const [selectedToken2, setToken2] = useState({});
  const [token1Input, setToken1Input] = useState("");
  const [token2Input, setToken2Input] = useState("");

  const [token1PerToken2, setPerToken1] = useState("1.4545");
  const [token2PerToken1, setPerToken2] = useState("0.66891");
  const [shareOfPool, setShare] = useState("0.04");

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const onToken1InputChange = (tokens) => {
    setToken1Input(tokens);
  };

  const onToken2InputChange = (tokens) => {
    setToken2Input(tokens);
  };

  const onToken1Select = (token) => {
    console.log(token);
    setToken1(token);
  };
  const onToken2Select = (token) => {
    console.log(token);
    setToken2(token);
  };

  const handleClearState = () => {
    setToken1Input("");
    setToken2Input("");
    setToken1(currentDefaultToken);
    setToken2({});
  };

  return (
    <>
      <SwapSettings open={settingOpen} handleClose={close} />
      <div className={classes.card}>
        <div className="card-theme">
          <div className={classes.cardContents}>
            <div className={classes.cardHeading}>
              <KeyboardBackspaceIcon
                fontSize="default"
                onClick={handleBack}
                className={classes.settingIcon}
              />
              <p>Add Liquidity</p>
              <TuneIcon
                fontSize="default"
                onClick={handleSettings}
                className={classes.settingIcon}
              />
            </div>

            <div className={classes.cardHeading}>
              <span>Select pair</span>
              <a className={classes.clearButton} onClick={handleClearState}>
                Clear all
              </a>
            </div>

            <div className={classes.depositCardsContainer}>
              <SwapCardItem
                onInputChange={onToken1InputChange}
                onTokenChange={onToken1Select}
                currentToken={selectedToken1}
              />
              <AddIcon fontSize="default" className={classes.settingIcon} />
              <SwapCardItem
                onInputChange={onToken2InputChange}
                onTokenChange={onToken2Select}
                currentToken={selectedToken2}
              />
            </div>

            {selectedToken1.symbol && selectedToken2.symbol ? (
              <>
                <div className={classes.cardSubHeading}>
                  <span
                    style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    Prices and Pool share
                  </span>
                </div>

                <div className={classes.selectPoolContainer}>
                  <div className={classes.feeSelectContainer}>
                    <div className={classes.feeSelectHeading}>
                      <p className={classes.feeSelectHeadingP}>
                        {token1PerToken2}
                      </p>
                    </div>
                    <span className={classes.feeSelectHeadingSpan}>
                      {`${selectedToken1.symbol} per ${selectedToken2.symbol}`}
                    </span>
                  </div>

                  <div className={classes.feeSelectContainer}>
                    <div className={classes.feeSelectHeading}>
                      <p className={classes.feeSelectHeadingP}>
                        {token2PerToken1}
                      </p>
                    </div>
                    <span className={classes.feeSelectHeadingSpan}>
                      {`${selectedToken2.symbol} per ${selectedToken1.symbol}`}
                    </span>
                  </div>

                  <div className={classes.feeSelectContainer}>
                    <div className={classes.feeSelectHeading}>
                      <p
                        className={classes.feeSelectHeadingP}
                      >{`${shareOfPool}%`}</p>
                    </div>
                    <span className={classes.feeSelectHeadingSpan}>
                      Share of pool
                    </span>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            <CustomButton variant="light" className={classes.addButton}>
              Add liquidity
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(AddCard);
