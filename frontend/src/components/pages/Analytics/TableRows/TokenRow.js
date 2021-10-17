import { makeStyles, TableCell, TableRow } from "@material-ui/core";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../../utils/helper";
import PercentLabel from "../../../common/PercentLabel";
import TokenIcon from "../../../common/TokenIcon";

const useStyles = makeStyles((theme) => ({
  name: {
    cursor: "pointer",
    color: "white",
  },
}));

const TokenRow = (props) => {
  const { row, classes, isItemSelected, labelId, handleClick } = props;

  const ownCLasses = useStyles();
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
          <Link to={`token/${row.id}`}>
            <TokenIcon symbol={row.symbol} />
            <span className={classes.cellText}>{row.name}</span>
          </Link>
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
        style={{ borderBottom: "1.5px solid #212121" }}
        className={classes.tableDesktop}
      >
        <TableCell padding="checkbox"></TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          <Link to={`token/${row.id}`}>
            <TokenIcon symbol={row.symbol} className={classes.tokenIcon} />
            <span className={ownCLasses.name}>{row.name} </span>
            <small className={classes.cellTextSecondary}>
              {"(" + row.symbol + ")"}
            </small>
          </Link>
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
      </TableRow>
    </>
  );
};

export default TokenRow;
