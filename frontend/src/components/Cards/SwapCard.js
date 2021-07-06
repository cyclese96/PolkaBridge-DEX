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
  const [token1Input, setToken1Input] = useState("");
  const [token2Input, setToken2Input] = useState("");

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

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
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
            />
            <SwapVertIcon fontSize="default" className={classes.settingIcon} />
            <SwapCardItem
              inputType="to"
              onInputChange={onToken2InputChange}
              onTokenChange={onToken2Select}
              currentToken={selectedToken2}
            />

            <CustomButton variant="light" className={classes.addButton}>
              Swap tokens
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
