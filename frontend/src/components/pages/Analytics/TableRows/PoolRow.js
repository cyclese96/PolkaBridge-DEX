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
        className={classes.tableMobile}
      >
        <TableCell padding="checkbox"></TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          <TokenIcon symbol={row.pairTokens[0]} />
          <TokenIcon symbol={row.pairTokens[1]} />

          <span className={classes.cellText}>
            {row.pairTokens[0]}/{row.pairTokens[1]}
          </span>
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
          <div>
            <TokenIcon symbol={row.pairTokens[0]} />
            <TokenIcon symbol={row.pairTokens[1]} />

            <span className={classes.cellText}>
              {row.pairTokens[0]}/{row.pairTokens[1]}
            </span>
            <small className={classes.cellTextSecondary}>
              {"( " + row.fee + "% )"}
            </small>
          </div>
        </TableCell>
        <TableCell align="right">
          <span className={classes.cellText}>
            {formatCurrency(row.tvl, true)}
          </span>
        </TableCell>

        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.vol_24_h, true)}
        </TableCell>
        <TableCell align="right" className={classes.cellText}>
          {formatCurrency(row.vol_7_d, true)}
        </TableCell>
      </TableRow>
    </>
  );
};

export default PoolRow;
