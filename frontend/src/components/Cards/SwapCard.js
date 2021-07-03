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
    padding: 15,
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
}));

const SwapCard = ({ account: { balance, loading }, tokenType }) => {
  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);

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

            <SwapCardItem inputType="from" />
            <SwapVertIcon fontSize="default" className={classes.settingIcon} />
            <SwapCardItem />
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
