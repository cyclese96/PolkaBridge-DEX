import { TableCell, TableRow } from "@material-ui/core";
import { formatCurrency } from "../../../../utils/helper";
import PercentLabel from "../../../common/PercentLabel";
import TokenIcon from "../../../common/TokenIcon";

const TokenRow = (props) => {
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
          <TokenIcon symbol={row.symbol} />
          <span className={classes.cellText}>{row.name}</span>
        </TableCell>

        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.oneDayData.tradeVolumeUSD, true)}
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
        style={{ borderBottom: "1.5px solid #212121" }}
        className={classes.tableDesktop}
      >
        <TableCell padding="checkbox"></TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          <TokenIcon symbol={row.symbol} className={classes.tokenIcon} />
          <span className={classes.cellText}>{row.name} </span>
          <small className={classes.cellTextSecondary}>
            {"(" + row.symbol + ")"}
          </small>
        </TableCell>
        <TableCell align="right">
          <span className={classes.cellText}>
            {formatCurrency(row.priceUSD, true)}
          </span>
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          <PercentLabel percentValue={row.priceChangeUSD} />
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.oneDayData.tradeVolumeUSD, true)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.totalLiquidtyUSD, true)}
        </TableCell>
      </TableRow>
    </>
  );
};

export default TokenRow;
