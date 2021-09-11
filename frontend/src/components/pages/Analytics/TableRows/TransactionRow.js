import { TableCell, TableRow } from "@material-ui/core";
import { formatCurrency } from "../../../../utils/helper";
import TokenIcon from "../../../common/TokenIcon";
import Moment from "react-moment";

const TransactionRow = (props) => {
  const { classes, isItemSelected, labelId, handleClick } = props;
  let row = props.row[0];
  return (
    <>
      {console.log("Transactions Row")}
      {console.log(row)}

      <TableRow
        hover
        onClick={(event) => handleClick(event, row.name)}
        //   role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        className={classes.tableMobile}
      >
        <TableCell padding="checkbox"></TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          <TokenIcon />
          <span className={classes.cellText}>{row.name}</span>
        </TableCell>

        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.vol_24_h, true)}
        </TableCell>
      </TableRow>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.name)}
        //   role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        className={classes.tableDesktop}
      >
        <TableCell padding="checkbox"></TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          <span className={classes.cellTextSecondary}>{row.__typename} </span>{" "}
          <span className={classes.cellText}>
            {row.pair.token0.symbol} And {row.pair.token1.symbol}{" "}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className={classes.cellText}>
            {formatCurrency(row.amountUSD, true)}
          </span>
        </TableCell>

        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.amount0, true)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.amount1, true)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          ...{row.sender.split("").splice(0, 10)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          <Moment fromNow>{Date(row.transaction.timestamp)}</Moment>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TransactionRow;
