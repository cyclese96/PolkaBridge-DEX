import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";
import { connect } from "react-redux";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import corgibImg from "../../assets/corgi.png";
import pwarImg from "../../assets/pwar.png";
import bite from "../../assets/bite.png";
import pbrImg from "../../assets/balance.png";
import etherImg from "../../assets/ether.png";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    height: 400,
    // maxWidth: 300,
    //   backgroundColor: theme.palette.background.paper,
  },
}));

const tokens = [
  {
    icon: pbrImg,
    name: "Polkabridge",
    symbol: "PBR",
  },
  {
    icon: bite,
    name: "DragonBite",
    symbol: "BITE",
  },
  {
    icon: pwarImg,
    name: "Polkawar",
    symbol: "PWAR",
  },
  {
    icon: corgibImg,
    name: "Corgib meme coin",
    symbol: "CORGIB",
  },
  {
    icon: etherImg,
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    icon: "",
    name: "Binance",
    symbol: "BNB",
  },
  {
    icon: "",
    name: "US tether",
    symbol: "USDT",
  },
];
function renderRow(props) {
  return tokens.map((token, index) => (
    <ListItem button key={index}>
      <ListItemAvatar>
        <Avatar src={token.icon}></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <p style={{ padding: 0, margin: 0, color: "white" }}>
            {" "}
            {token.symbol}
          </p>
        }
        secondary={
          <span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 200 }}>
            {token.name}
          </span>
        }
      />
    </ListItem>
  ));
}

const TokenList = ({
  account: { currentAccount, balance, connected, currentNetwork },
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(TokenList);
