import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const CustomSnackBar = ({ status, message, handleClose }) => {
  const [alert, setAlert] = React.useState({
    status: status,
    message: message,
  });
  const vertical = "top";
  const horizontal = "right";

  return (
    <Snackbar
      autoHideDuration={4000}
      anchorOrigin={{ vertical, horizontal }}
      open={alert.status}
      onClose={handleClose}
      message={alert.message}
      key={vertical + horizontal}
    >
      <Alert severity="error">{alert.message}</Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
