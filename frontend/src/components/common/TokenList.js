import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
    height: 40,
    width: 40,
    padding: 3,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.tokenBack,
    [theme.breakpoints.down("sm")]: {
      height: 32,
    },
  },
  tokenTitle: {
    padding: 0,
    margin: 0,
    color: theme.palette.textColors.heading,
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      fontSize: 15,
    },
  },
  tokenSubtitle: {
    color: theme.palette.textColors.subheading,
    fontWeight: 400,
    fontSize: 12,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  listItem: {
    "&:hover": {
      background: "rgba(0, 0, 0, 0.2)",
      borderRadius: 3,
    },
  },
}));

const TokenList = ({ handleItemSelected, tokens, disableToken }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {tokens.map((token, index) => (
        <ListItem
          style={{ height: 65 }}
          button
          key={index}
          className={classes.listItem}
          onClick={() => handleItemSelected(token)}
          disabled={
            !disableToken ? false : token.symbol === disableToken.symbol
          }
        >
          <ListItemAvatar>
            <TokenIcon address={token?.address} className={classes.tokenIcon} />
          </ListItemAvatar>
          <ListItemText
            primary={<p className={classes.tokenTitle}>{token.symbol}</p>}
            secondary={
              <span className={classes.tokenSubtitle}>{token.name}</span>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default React.memo(TokenList);
