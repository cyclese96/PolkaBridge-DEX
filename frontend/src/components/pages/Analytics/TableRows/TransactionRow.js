import { TableCell, TableRow } from "@material-ui/core";
import { formatCurrency } from "../../../../utils/helper";
import PercentLabel from "../../../common/PercentLabel";
import TokenIcon from "../../../common/TokenIcon";

const TransactionRow = (props) => {
  const { row, classes, isItemSelected, labelId, handleClick } = props;

  return (
    <>
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
          <TokenIcon symbol={row.symbol} className={classes.tokenIcon} />
          <span className={classes.cellText}>{row.name} </span>
          <small className={classes.cellTextSecondary}>
            {"( " + row.symbol + " )"}
          </small>
        </TableCell>
        <TableCell align="right">
          <span className={classes.cellText}>
            {formatCurrency(row.price, true)}
          </span>
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          <PercentLabel percentValue={row.price_change} />
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.vol_24_h, true)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.tvl, true)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          3 mins ago
        </TableCell>
      </TableRow>
    </>
  );
};

export default TransactionRow;
