import { TableCell, TableRow } from "@material-ui/core";
import { formatCurrency } from "../../../../utils/helper";
import PercentLabel from "../../../common/PercentLabel";
import TokenIcon from "../../../common/TokenIcon";

const PoolRow = (props) => {
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
        style={{ borderBottom: "1.5px solid #212121" }}
        className={classes.tableMobile}
      >
        <TableCell padding="checkbox"></TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          <TokenIcon symbol={row.token0.symbol} />
          <TokenIcon symbol={row.token1.symbol} />

          <span className={classes.cellText}>
            {row.token0.symbol}/{row.token1.symbol}
          </span>
        </TableCell>

        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.oneDayVolumeUSD, true)}
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
        style={{ borderBottom: "2px solid #212121" }}
        className={classes.tableDesktop}
      >
        <TableCell padding="checkbox"></TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          <div>
            <TokenIcon symbol={row.token0.symbol} />
            <TokenIcon symbol={row.token1.symbol} />

            <span className={classes.cellText}>
              {row.token0.symbol}/{row.token1.symbol}
            </span>
            <small className={classes.cellTextSecondary}>
              {"( " + "0.02" + "% )"}
            </small>
          </div>
        </TableCell>
        <TableCell align="right">
          <span className={classes.cellText}>
            {formatCurrency(row.volumeUSD, true)}
          </span>
        </TableCell>

        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.oneDayVolumeUSD, true)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.oneWeekVolumeUSD, true)}
        </TableCell>
      </TableRow>
    </>
  );
};

export default PoolRow;
