import React, { useEffect, useState } from "react";
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
import { topPoolsData, topTokensData } from "./tableData";
import TokenRow from "./TableRows/TokenRow";
import PoolRow from "./TableRows/PoolRow";
import TransactionRow from "./TableRows/TransactionRow";
import { Card } from "@material-ui/core";
import { topTransactions } from "../../../apollo/queries";

function descendingComparator(a, b, orderBy) {
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
  const stabilizedThis = array.map((el, index) => [el, index]);
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
      id: "pool",
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
      id: "type",
      numeric: false,
      disablePadding: true,
      label: "#Token",
    },
    {
      id: "total_value",
      numeric: true,
      disablePadding: false,
      label: "Total Value",
    },
    {
      id: "token1_amount",
      numeric: true,
      disablePadding: false,
      label: "Token Amount",
    },
    {
      id: "token2_amount",
      numeric: true,
      disablePadding: false,
      label: "Token Amount",
    },
    { id: "account", numeric: true, disablePadding: false, label: "Account" },
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
    [theme.breakpoints.down("sm")]: {
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
  console.log(window.innerWidth);

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
      width: "92vw",
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
    [theme.breakpoints.down("sm")]: {
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

const TopTokens = ({ tableType = "TopTokens" }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [transactions, setTransactions] = useState([]);

  const rows = (tableType) => {
    switch (tableType) {
      case "TopTokens":
        return topTokensData;
      case "TopPools":
        return topPoolsData;
      case "Transactions":
        return transactions;
      default:
        return topPoolsData;
    }
  };

  useEffect(async () => {
    const page = 1;
    const order = "desc";
    const transactions = await topTransactions(page, order);
    //Format transactions data
    formatTransactions(transactions);
  }, []);

  const formatTransactions = (transactions) => {
    let fotmattedTxs = transactions.map((singleTx) => {
      return singleTx.burns.length === 0
        ? singleTx.mints.length === 0
          ? singleTx.swaps
          : singleTx.mints
        : singleTx.burns;
    });
    setTransactions(fotmattedTxs);
    console.log(fotmattedTxs);
  };

  const handleRequestSort = (event, property) => {
    console.log("sort ", property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows(tableType).map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    console.log("ordering...");
    // const selectedIndex = selected.indexOf(name);
    // let newSelected = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1)
    //   );
    // }

    // setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rows(tableType).length - page * rowsPerPage);

  const currenTokenRow = (
    tableType,
    row,
    classes,
    isItemSelected,
    labelId,
    handleClick
  ) => {
    if (tableType === "TopTokens") {
      return (
        <TokenRow
          row={row}
          classes={classes}
          isItemSelected={isItemSelected}
          labelId={labelId}
          handleClick={handleClick}
        />
      );
    } else if (tableType === "TopPools") {
      return (
        <PoolRow
          row={row}
          classes={classes}
          isItemSelected={isItemSelected}
          labelId={labelId}
          handleClick={handleClick}
        />
      );
    } else {
      return (
        <TransactionRow
          row={row}
          classes={classes}
          isItemSelected={isItemSelected}
          labelId={labelId}
          handleClick={handleClick}
        />
      );
    }
  };
  return (
    <Card className={classes.card}>
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
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows(tableType).length}
            tableType={tableType}
          />
          <TableBody>
            {stableSort(rows(tableType), getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return currenTokenRow(
                  tableType,
                  row,
                  classes,
                  isItemSelected,
                  labelId,
                  handleClick
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
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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
