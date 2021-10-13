import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    table: {
        border: "1px solid #616161",
        background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
        borderRadius: 15,
        color: "white",
    },
    tableRow: {
        color: "white",
    },
    pagination: {
        paddingTop: 10,
        paddingBottom: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
    },
    paginationButton: {
        color: "#DF097C",
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        fontSize: 13,
    },
}));

const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "price", label: "Price", minWidth: 100, align: "right" },
    {
        id: "price_Change",
        label: "Price Change",
        minWidth: 170,
        align: "right",
    },
    {
        id: "vol24",
        label: "Volume 24Hrs",
        minWidth: 170,
        align: "right",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "tvl",
        label: "TVL",
        minWidth: 170,
        align: "right",
        format: (value) => value.toFixed(2),
    },
];

export default function TopTokens() {
    const classes = useStyles();

    let rows = [
        { name: "Ether", price: "10", change: "10", volume: 11, tvl: 2.4 },
        { name: "Ether", price: "10", change: "10", volume: 11, tvl: 2.4 },
        { name: "Ether", price: "10", change: "10", volume: 11, tvl: 2.4 },
        { name: "Ether", price: "10", change: "10", volume: 11, tvl: 2.4 },
        { name: "Ether", price: "10", change: "10", volume: 11, tvl: 2.4 },
    ];
    return (
        <Paper
            sx={{
                width: "100%",
                overflow: "hidden",
                color: "white",
                background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
            }}
        >
            <TableContainer
                sx={{
                    maxHeight: 440,
                }}
            >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        color: "white",
                                        fontWeight: 700,
                                        backgroundColor: "black",
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((singleRow) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                    <TableCell sx={{ color: "whitesmoke" }}>
                                        {singleRow.name}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "whitesmoke" }}>
                                        {singleRow.price}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "whitesmoke" }}>
                                        {singleRow.change}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "whitesmoke" }}>
                                        {singleRow.volume}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "whitesmoke" }}>
                                        {singleRow.tvl}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={classes.pagination}>
                <Button className={classes.paginationButton}>{"<< Prev"}</Button>|{" "}
                <Button className={classes.paginationButton}>{"Next >>"}</Button>
            </div>
        </Paper>
    );
}
