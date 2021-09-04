import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { List } from "@material-ui/core";
import TokenIcon from "./TokenIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    position: "relative",
    overflowY: "auto",
    maxHeight: 380,
  },
  tokenIcon: {
    height: 30,
    borderRadius: "50%",
  },
}));

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
          style={{ height: 60 }}
          button
          key={index}
          onClick={() => handleItemSelected(token)}
          disabled={
            !disableToken ? false : token.symbol === disableToken.symbol
          }
        >
          <ListItemAvatar>
            <TokenIcon symbol={token.symbol} className={classes.tokenIcon} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <p
                style={{ padding: 0, margin: 0, color: "white", fontSize: 15 }}
              >
                {token.symbol}
              </p>
            }
            secondary={
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 300,
                  fontSize: 12,
                }}
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
