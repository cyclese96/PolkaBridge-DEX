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
    border: "0.5px solid white",
    borderRadius: 10,
    cursor: "pointer",
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
  priceChangeContainer: {
    width: 150,
    // height: 20,
    padding: 6,
    marginLeft: 5,
    marginRight: 5,
    border: "0.5px solid #E0077D",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // "&:hover": {
    //   background: "rgba(255, 255, 255, 0.8)",
    // },
  },
  buttons: {
    display: "flex",
    marginBottom: 10,
    marginTop: 5,
  },
  priceChangeButton: {
    width: 50,
    height: 23,
  },
  currentPriceContainer: {
    width: "94%",
    // height: 20,
    // padding: 6,
    // marginLeft: 5,
    // marginRight: 5,
    border: "0.5px solid white",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    marginBottom: 10,
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
  },
}));

const AddCard = ({ account: { balance, loading }, tokenType, handleBack }) => {
  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState({
    icon: etherImg,
    name: "Ethereum",
    symbol: "ETH",
  });
  const [fee, setFee] = useState(0.3);
  const [selectedToken2, setToken2] = useState({});

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const onTokenSelect1 = (token) => {
    console.log(token);
    setToken1(token);
  };
  const onTokenSelect2 = (token) => {
    console.log(token);
    setToken2(token);
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
              <a>Clear all</a>
            </div>

            <div className={classes.tokenPair}>
              <div>
                <SelectToken
                  className={classes.selectToken}
                  selectedToken={selectedToken1}
                  handleTokenSelected={onTokenSelect1}
                />
              </div>
              <div>
                <SelectToken
                  className={classes.selectToken}
                  selectedToken={selectedToken2}
                  handleTokenSelected={onTokenSelect2}
                />
              </div>
            </div>

            <div className={classes.cardHeading}>
              <span>Select pool</span>
            </div>

            <div className={classes.cardSubHeading}>
              <span style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }}>
                Select a pool type based on your preferred liquidity provider
                fee.
              </span>
            </div>

            <div className={classes.selectPoolContainer}>
              <div
                className={classes.feeSelectContainer}
                onClick={() => setFee(0.05)}
              >
                <div className={classes.feeSelectHeading}>
                  <p className={classes.feeSelectHeadingP}>0.05% fee</p>
                  {fee === 0.05 ? (
                    <CheckCircleIcon
                      className={classes.checkIcon}
                      fontSize="small"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <span className={classes.feeSelectHeadingSpan}>
                  Best for stable pairs
                </span>
              </div>

              <div
                className={classes.feeSelectContainer}
                onClick={() => setFee(0.3)}
              >
                <div className={classes.feeSelectHeading}>
                  <p className={classes.feeSelectHeadingP}> 0.3% fee</p>
                  {fee === 0.3 ? (
                    <CheckCircleIcon
                      className={classes.checkIcon}
                      fontSize="small"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <span className={classes.feeSelectHeadingSpan}>
                  Best for most pairs
                </span>
              </div>

              <div
                className={classes.feeSelectContainer}
                onClick={() => setFee(1)}
              >
                <div className={classes.feeSelectHeading}>
                  <p className={classes.feeSelectHeadingP}>1% fee</p>
                  {fee === 1 ? (
                    <CheckCircleIcon
                      className={classes.checkIcon}
                      fontSize="small"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <span className={classes.feeSelectHeadingSpan}>
                  Best for exotic pairs
                </span>
              </div>
            </div>

            <div className={classes.cardHeading}>
              <span>Set Price Range</span>
            </div>

            <div className={classes.priceRangeCardContainer}>
              <div className={classes.priceChangeContainer}>
                <span className={classes.feeSelectHeadingSpan}>Min Price</span>
                <p style={{ margin: 0, padding: 0 }}>{0}</p>
                <span className={classes.feeSelectHeadingSpan}>
                  PBR per ETH
                </span>

                <div className={classes.buttons}>
                  <CustomButton
                    variant="light"
                    className={classes.priceChangeButton}
                  >
                    - 0.1
                  </CustomButton>
                  <CustomButton
                    variant="light"
                    className={classes.priceChangeButton}
                  >
                    + 0.1
                  </CustomButton>
                </div>
              </div>

              <div className={classes.priceChangeContainer}>
                <span className={classes.feeSelectHeadingSpan}>Max Price</span>
                <p style={{ margin: 0, padding: 0 }}>{0}</p>
                <span className={classes.feeSelectHeadingSpan}>
                  PBR per ETH
                </span>

                <div className={classes.buttons}>
                  <CustomButton
                    variant="light"
                    className={classes.priceChangeButton}
                  >
                    - 0.1
                  </CustomButton>
                  <CustomButton
                    variant="light"
                    className={classes.priceChangeButton}
                  >
                    + 0.1
                  </CustomButton>
                </div>
              </div>
            </div>

            <div className={classes.currentPriceContainer}>
              <span className={classes.feeSelectHeadingSpan}>
                Current Price
              </span>
              <p style={{ margin: 0, padding: 0 }}>{0.0}</p>
              <span className={classes.feeSelectHeadingSpan}>PBR per ETH</span>
            </div>

            <div className={classes.cardHeading}>
              <span>Deposit Amounts</span>
            </div>

            <div className={classes.depositCardsContainer}>
              <SwapCardItem inputType={null} />
              <SwapCardItem inputType={null} />
            </div>

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
