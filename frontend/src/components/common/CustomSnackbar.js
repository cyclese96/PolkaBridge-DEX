import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, Slide } from "@material-ui/core";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 50,
  },
}));

const CustomSnackBar = ({ status, message, error = false, handleClose }) => {
  const classes = useStyles();
  const vertical = "top";
  const horizontal = "right";

  const options = 4000;

  return (
    <Snackbar
      autoHideDuration={2000}
      anchorOrigin={{ vertical, horizontal }}
      open={status}
      onClose={handleClose}
      message={message}
      key={vertical + horizontal}
      className={classes.root}
    >
      <Alert severity={error ? "error" : "success"}>{message}</Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
