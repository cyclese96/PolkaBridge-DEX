import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TokenRow from "./TableRows/TokenRow";
import PoolRow from "./TableRows/PoolRow";
import TransactionRow from "./TableRows/TransactionRow";
import { Card } from "@material-ui/core";
import { useMemo } from "react";

function descendingComparator(a, b, orderBy) {
  if (!a || !b) {
    return 0;
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  // console.log("stableSort", array);
  if (!array || array.length === 0 || Object.keys(array).length === 0) {
    return;
  }
  const stabilizedThis = array.map((el, index) => [el, index]);
  // console.log("stabilizedThis", stabilizedThis);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = {
  TopTokens: [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "# Name",
    },
    { id: "price", numeric: true, disablePadding: false, label: "Price" },
    {
      id: "price_change",
      numeric: true,
      disablePadding: false,
      label: "Price Change",
    },
    {
      id: "vol_24_h",
      numeric: true,
      disablePadding: false,
      label: "Volume 24 H",
    },
    { id: "tvl", numeric: true, disablePadding: false, label: "TVL" },
  ],
  TopPools: [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "# Pool",
    },
    { id: "tvl", numeric: true, disablePadding: false, label: "TVL" },
    {
      id: "vol_24_h",
      numeric: true,
      disablePadding: false,
      label: "Volume 24H",
    },
    {
      id: "vol_7_d",
      numeric: true,
      disablePadding: false,
      label: "Volume 7D",
    },
  ],
  Transactions: [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "#Transaction",
    },
    {
      id: "total_value",
      numeric: true,
      disablePadding: false,
      label: "Total Value",
    },
    {
      id: "amount0",
      numeric: true,
      disablePadding: false,
      label: "Token Amount",
    },
    {
      id: "amount1",
      numeric: true,
      disablePadding: false,
      label: "Token Amount",
    },
    { id: "sender", numeric: true, disablePadding: false, label: "Account" },
    { id: "time", numeric: true, disablePadding: false, label: "Time" },
  ],
};
const headCellMobile = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "# Name",
  },
  {
    id: "vol_24_h",
    numeric: true,
    disablePadding: false,
    label: "Volume 24 H",
  },
];

const useHeadStyles = makeStyles((theme) => ({
  headStyle: {
    color: "#bdbdbd",
    fontSize: 16,
    margin: 0,
    padding: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      width: 80,
    },
  },
  sortIcons: {
    opacity: 1,
    color: "rgba(255,255,255,0.5)",
  },
  desktop: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mobile: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    tableType,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const ownClasses = useHeadStyles();
  // console.log(window.innerWidth);

  return (
    <TableHead>
      <TableRow className={ownClasses.mobile}>
        <TableCell padding="checkbox"></TableCell>
        {headCellMobile.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            // style={{ color: "#E0077D" }}s
          >
            <TableSortLabel
              // active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              classes={{
                icon:
                  orderBy !== headCell.id
                    ? ownClasses.sortIcons
                    : ownClasses.sortIcons,
              }}
            >
              <p className={ownClasses.headStyle}>{headCell.label}</p>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>

      <TableRow className={ownClasses.desktop}>
        <TableCell padding="checkbox"></TableCell>
        {headCells[tableType].map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            // style={{ color: "#E0077D" }}s
          >
            <TableSortLabel
              // active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              classes={{
                icon:
                  orderBy !== headCell.id
                    ? ownClasses.sortIcons
                    : ownClasses.sortIcons,
              }}
            >
              <p className={ownClasses.headStyle}>{headCell.label}</p>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    border: "1px solid #616161",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    borderRadius: 15,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    [theme.breakpoints.down("sm")]: {
      minWidth: 200,
      width: "90vw",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  tableHeadText: {
    color: "white",
  },
  cellText: {
    color: "white",
    marginLeft: 6,
    marginRight: 6,
    fontSize: 12,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      width: 100,
    },
  },
  cellTextSecondary: {
    color: "rgba( 255, 255, 255, 0.4 )",
  },
  tableDesktop: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  tableMobile: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  tokenIcon: {
    // marginRight: 7,
  },
}));
// tableTypes:  "TopTokens" , "TopPools", "Transactions"
// const rows = topTokensData;

const TopTokens = ({
  tableType = "TopTokens",
  allTokens,
  allPairs,
  allTransactions,
}) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("vol_24_h");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // const [transactions, setTransactions] = useState([]);
  // const [pairs, setPairs] = useState([]);
  // const [tokens, setTokens] = useState([]);

  // useEffect(() => {
  //   if (!allTransactions) {
  //     return;
  //   }
  //   console.log("raw transactions list ", allTransactions);
  // }, [Object.keys(!allTransactions ? {} : allTransactions)]);

  // id: 1,
  // token0: {id, name, symbol,... },
  // fee: 0.3,
  // tvl: 572.82,
  // vol_24_h: 882.93,
  // vol_7_d: 882.93,
  const getFormattedPoolObject = (rawObject) => {
    const _formtattedObj = {
      id: rawObject.id,
      name: rawObject.token0.symbol,
      token0: rawObject.token0,
      token1: rawObject.token1,
      fee: 0.02,
      tvl: rawObject.trackedReserveUSD,
      vol_24_h: rawObject.oneDayVolumeUSD,
      vol_7_d: rawObject.oneWeekVolumeUSD,
    };
    return _formtattedObj;
  };
  const formattedPairs = useMemo(() => {
    return (
      allPairs &&
      Object.keys(allPairs).map((key) => getFormattedPoolObject(allPairs[key]))
    );
  }, [allPairs]);

  const getFormattedTokenObject = (rawObject) => {
    const obj = {
      id: rawObject.id,
      name: rawObject.name,
      symbol: rawObject.symbol,
      price: rawObject.priceUSD,
      price_change: rawObject.priceChangeUSD,
      vol_24_h: rawObject.oneDayVolumeUSD,
      tvl: rawObject.totalLiquidtyUSD,
    };
    return obj;
  };
  const formattedTokens = useMemo(() => {
    return (
      allTokens &&
      Object.keys(allTokens).map(
        (key) => allTokens[key].id && getFormattedTokenObject(allTokens[key])
      )
    );
  }, [allTokens]);

  const getFormattedTransactionObject = (rawObject) => {
    const obj = {
      id: rawObject.transaction.id,
      transactionType: rawObject.__typename,
      token0: rawObject.pair.token0,
      token1: rawObject.pair.token1,
      total_value: rawObject.amountUSD,
      amount0: rawObject.amount0,
      amount1: rawObject.amount1,
      sender: rawObject.sender,
      time: rawObject.transaction.timestamp,
    };
    return obj;
  };
  const formattedTransactions = useMemo(() => {
    if (!allTransactions || Object.keys(allTransactions).length === 0) {
      return [];
    }
    const _mints = !allTransactions.mints ? [] : allTransactions.mints;
    const _swaps = !allTransactions.swaps ? [] : allTransactions.swaps;
    const _burns = !allTransactions.burns ? [] : allTransactions.burns;
    const _all = [..._mints, ..._swaps, ..._burns];
    // console.log("all formattedTransactions transactions", _all);
    return _all && _all.map((item) => getFormattedTransactionObject(item));
  }, [allTransactions]);

  const handleRequestSort = (event, property) => {
    // console.log("sort ", property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = rows(tableType).map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, name) => {
    // console.log("row clicked...", name);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = 0;
  // rowsPerPage -
  // Math.min(rowsPerPage, rows(tableType).length - page * rowsPerPage);

  const rows = (tableType) => {
    switch (tableType) {
      case "TopTokens":
        return formattedTokens;
      case "TopPools":
        return formattedPairs;
      case "Transactions":
        return formattedTransactions;
      default:
        return formattedTokens;
    }
  };

  const CurrenTokenRow = ({ tableType, classes, handleClick }) => {
    if (tableType === "TopTokens") {
      // console.log(formattedTokens);
      return (
        <>
          {formattedTokens.length > 0
            ? stableSort(formattedTokens, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = row ? isSelected(row.name) : false;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TokenRow
                      row={!row ? {} : row}
                      classes={classes}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      handleClick={handleClick}
                    />
                  );
                })
            : ""}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: 53 * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </>
      );
    } else if (tableType === "TopPools") {
      return (
        <>
          {formattedPairs.length > 0 &&
            stableSort(formattedPairs, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <PoolRow
                    row={!row ? {} : row}
                    classes={classes}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                  />
                );
              })}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: 53 * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </>
      );
    } else {
      return (
        <>
          {formattedTransactions.length > 0 &&
            stableSort(formattedTransactions, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = row ? isSelected(row.name) : false;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TransactionRow
                    row={!row ? {} : row}
                    classes={classes}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                  />
                );
              })}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: 53 * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </>
      );
    }
  };
  return (
    <Card elevation={10} className={classes.card}>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            // onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows(tableType).length}
            tableType={tableType}
          />
          <TableBody>
            <CurrenTokenRow
              tableType={tableType}
              classes={classes}
              handleClick={handleClick}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={rows(tableType).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ color: "#E0077D" }}
      />
    </Card>
  );
};

export default TopTokens;
