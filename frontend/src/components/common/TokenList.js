import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { List } from "@material-ui/core";
import { supportedTokens } from "../../constants";
import tokenThumbnail from "../../utils/tokenThumbnail";
import TokenIcon from "./TokenIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 15,
    marginBottom: 15,
    width: "100%",
    maxWidth: 360,
    position: "relative",
    overflow: "auto",
    maxHeight: 380,
  },
  tokenIcon: {
    height: 30,
  },
}));

function renderRow(props) {
  const { index } = props;
  let tokenData = {};
  return (
    <ListItem button key={index}>
      <ListItemAvatar>
        <Avatar src={tokenData.icon}></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <p style={{ padding: 0, margin: 0, color: "white" }}>
            {tokenData.symbol}
          </p>
        }
        secondary={
          <span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 200 }}>
            {tokenData.name}
          </span>
        }
      />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

const TokenList = ({
  account: { currentAccount, balance, connected, currentNetwork },
  handleItemSelected,
  tokens,
  disableToken,
}) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {tokens.map((token, index) => (
        <ListItem
          button
          key={index}
          onClick={() => handleItemSelected(token)}
          disabled={
            !disableToken ? false : token.symbol === disableToken.symbol
          }
        >
          <ListItemAvatar>
            {/* <Avatar src={tokenThumbnail(token.symbol)}></Avatar> */}
            <TokenIcon symbol={token.symbol} className={classes.tokenIcon} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <p style={{ padding: 0, margin: 0, color: "white" }}>
                {token.symbol}
              </p>
            }
            secondary={
              <span
                style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 200 }}
              >
                {token.name}
              </span>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(TokenList);
