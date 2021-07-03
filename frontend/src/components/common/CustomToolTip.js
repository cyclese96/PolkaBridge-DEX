import React from "react";
import { withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#121827",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const CustomToolTip = ({ title, placement, children }) => {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <a>{title}</a>
        </React.Fragment>
      }
      placement={placement || "top-center"}
    >
      {children}
    </HtmlTooltip>
  );
};

export default CustomToolTip;
