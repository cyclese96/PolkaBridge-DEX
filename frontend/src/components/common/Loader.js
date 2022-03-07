import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  loader: {
    height: 150,
  },
}));

const Loader = () => {
  const classes = useStyles();

  return (
    <div>
      <img
        src="https://thumbs.gfycat.com/LameDifferentBalloonfish-small.gif"
        alt="loader"
        className={classes.loader}
      />
    </div>
  );
};

export default React.memo(Loader);
