import { makeStyles } from "@material-ui/core";
import supply from "../../assets/supply.png";
import biteImg from "../../assets/bite.png";
import corgibImg from "../../assets/corgi.png";
import pwarImg from "../../assets/pwar.png";
import { connect } from "react-redux";
import TuneIcon from "@material-ui/icons/Tune";
import SwapCardItem from "./SwapCardItem";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import { useState } from "react";
import SwapSettings from "../common/SwapSettings";
import etherImg from "../../assets/ether.png";
import CustomButton from "../Buttons/CustomButton";
import BigNumber from "bignumber.js";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
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
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingIcon: {
    color: "#f6f6f6",
    cursor: "pointer",
  },

  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  addButton: {
    height: 45,
    width: "90%",
    marginTop: 30,
    marginBottom: 5,
  },
}));

const SwapCard = ({ account: { balance, loading }, tokenType }) => {
  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState({
    icon: etherImg,
    name: "Ethereum",
    symbol: "ETH",
  });
  const [selectedToken2, setToken2] = useState({});
  const [token1Value, setToken1Value] = useState("");
  const [token2Value, setToken2Value] = useState("");

  const [swapStatus, setStatus] = useState({
    message: "Please select tokens",
    disabled: true,
  });



  const verifySwapStatus = (token1 , token2) => {
    if ( token1.selected.symbol === token2.selected.symbol){
      setStatus({ message: "Invalid pair", disabled: true });
    }else if((  !token1.value  && token1.selected.symbol) || (!token2.value && token2.selected.symbol)) {
      setStatus({ message: "Enter amounts", disabled: true });
    }else if(!token1.selected.symbol || !token2.selected.symbol){
      setStatus({ message: "Select both tokens", disabled: true });
    }else if(token1.value > 0 && token2.value > 0 && token1.selected.symbol && token2.selected.symbol ){
      setStatus({ message: "Swap Tokens", disabled: false });
    }
  }


  const onToken1InputChange = (tokens) => {
    setToken1Value(tokens);

    verifySwapStatus({value:tokens, selected: selectedToken1}, {value:token2Value, selected: selectedToken2})
  };

  const onToken2InputChange = (tokens) => {
    console.log("inpuit", !tokens);
    setToken2Value(tokens);

    verifySwapStatus({value:token1Value, selected: selectedToken1}, {value:tokens, selected: selectedToken2})

  };

  const onToken1Select = (token) => {
    setToken1(token);
    verifySwapStatus({value:token1Value, selected: token}, {value:token2Value, selected: selectedToken2})
  };

  const onToken2Select = (token) => {
    setToken2(token);

    verifySwapStatus({value:token1Value, selected: selectedToken1}, {value:token2Value, selected: token})
  };

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const handleSwapToken = () => {
    //todo perform swap action on given input
  };

  return (
    <>
      <SwapSettings open={settingOpen} handleClose={close} />
      <div className={classes.card}>
        <div className="card-theme">
          <div className={classes.cardContents}>
            <div className={classes.cardHeading}>
              <p>Swap tokens </p>
              <TuneIcon
                fontSize="default"
                onClick={handleSettings}
                className={classes.settingIcon}
              />
            </div>

            <SwapCardItem
              inputType="from"
              onInputChange={onToken1InputChange}
              onTokenChange={onToken1Select}
              currentToken={selectedToken1}
              inputValue={token1Value}
            />
            <SwapVertIcon fontSize="default" className={classes.settingIcon} />
            <SwapCardItem
              inputType="to"
              onInputChange={onToken2InputChange}
              onTokenChange={onToken2Select}
              currentToken={selectedToken2}
              inputValue={token2Value}
            />

            <CustomButton
              variant="light"
              className={classes.addButton}
              onClick={handleSwapToken}
              disabled={swapStatus.disabled}
            >
              {swapStatus.message}
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

export default connect(mapStateToProps, {})(SwapCard);
