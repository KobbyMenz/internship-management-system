import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  //   IconButton,
  TablePagination,
  //   TextField,
  Box,
  //   Button,
  Typography,
} from "@mui/material";
import ComboBox from "../ComboBox/ComboBox";
import PrintReport from "../PrintReport/PrintReport";
import FormatCurrency from "../../Functions/FormatCurrency";
import FormatNumber from "../../Functions/FormatNumber";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
//import CustomButton from "../Button";
//import SearchBar from "../SeachBar";
//import DateInput from "../DateInput/DateInput";
//import Tag from "../Tag/Tag";

const ReportPT = ({
  columns,
  rows,
  onClickCloseBtn,
  //   dataSet,
  onChange,
  value,
  option,
  filteredMonthlySales,
  monthlySales,
  totalAmount,
  totalProfit,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //  const [search, setSearch] = useState("");

  const filteredRows = rows;
  // Filter rows based on search
  //   const filteredRows = rows.filter((row) =>
  //     Object.values(row).some((value) =>
  //       String(value).toLowerCase().includes(search.toLowerCase())
  //     )
  //   );

  const currentYear = new Date().getFullYear();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      sx={{
        pr: 2,
        pl: 2,
        pt: 2,
        // pb: 1,
        borderRadius: 2,
        // boxShadow: "0rem 0.2rem 1rem rgba(0, 0, 0, 0.25)",
        // boxShadow: "0 2px 0.8rem rgba(0,0,0,0.1)",
        backgroundColor: "var(--bg-color2)",
        color: "var(--text-color)",
        // fontSize: "1.4rem",
      }}
    >
      <h2 style={{ fontWeight: "500", color: "var(--primary)" }}>
        Sales Report
      </h2>
      {/* Header section */}
      <Box
        display="flex"
        flexWrap={"wrap"}
        gap={1}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bolder",
              fontSize: "1.5rem",
              color: "var(--text-color)",
            }}
          >
            Number of Items: {FormatNumber(filteredRows.length)}
          </Typography>

          {/* <Tag title={`Amount of Items:`} number={amount} /> */}
        </Box>

        <Box
          display="flex"
          gap={"1rem"}
          flexWrap={"wrap-reverse"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          flexGrow={1}
        >
          <div style={{ width: "22rem" }}>
            <ComboBox
              onClickCloseBtn={onClickCloseBtn}
              placeholder={`----Select year----`}
              value={value}
              id="year"
              name="year"
              onChange={onChange}
              //   dataSet={dataSet}
              option={option}
            />
          </div>

          <PrintReport
            filteredMonthlySales={filteredMonthlySales}
            year={value}
            monthlySales={monthlySales}
            totalAmount={totalAmount}
            totalProfit={totalProfit}
          />
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            borderTop: "0.1rem solid var(--bg-color)",
            borderRight: "0.1rem solid var(--bg-color)",
            borderBottom: "0.1rem solid var(--bg-color)",
            borderRadius: "1rem",
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                border: "none",
                color: "var(--text-color)",
                fontSize: "1.5rem",
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    color: "#fff",
                    fontWeight: "bolder",
                    fontSize: "1.5rem",
                    backgroundColor: "var(--primary)",
                    borderLeft: "0.1rem solid var(--table-header)",
                    borderBottom: "none",
                  }}
                >
                  {col.type === "salesId" ? "" : col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length !== 0 ? (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "var(--table-strip)",
                      },
                      "&:hover": { backgroundColor: "var(--hover-color)" },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        sx={{
                          fontSize: "1.5rem",
                          color: "var(--text-color)",
                          borderBottom: "1px solid var(--bg-color)",
                          borderLeft: "0.1rem solid var(--bg-color)",
                        }}
                        key={col.field}
                      >
                        {col.type === "sn" ? (
                          <span
                            style={{
                              padding: "1.7rem 0.15rem",
                              borderTopRightRadius: "1rem",
                              borderBottomRightRadius: "1rem",
                              marginLeft: "-1.6rem",
                              marginRight: "1.2rem",
                              backgroundColor:
                                row.year !== currentYear
                                  ? "#ffa600b6"
                                  : "#04ca3fbe",
                              fontWeight: "400",
                              fontSize: "1.5rem",
                            }}
                          >
                            {/* {row[col.field]} */}
                          </span>
                        ) : (
                          ""
                          //   row[col.field]
                        )}

                        {row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ fontSize: "1.5rem", color: "var(--text-color)" }}
                >
                  Data not found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        rowGap={"0rem"}
        columnGap={1}
        // paddingTop={1}
        // borderTop="0.3rem solid var(--primary)"
      >
        <Box
          fontSize="1.5rem"
          fontWeight="500"
          display="flex"
          alignItems={"center"}
          rowGap={"0.5rem"}
          columnGap={3}
          // paddingTop={"0.5rem"}
        >
          <p>Total Sales: {FormatCurrency(totalAmount)}</p>
          <p>Total Profit: {FormatCurrency(totalProfit)}</p>
        </Box>

        {/* Pagination */}
        <TablePagination
          sx={{
            fontSize: "1.4rem",
            flexGrow: "1",
            color: "var(--text-color)",
            "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: "1.4rem",
              },

            "& .MuiTablePagination-select": {
              fontSize: "1.5rem",
            },

            "& .MuiSvgIcon-root": {
              fontSize: "1.6rem",
              color: "var(--text-color) !important",
            },

            "& .MuiTablePagination-actions": {
              fontSize: "1.6rem",
            },
            "& .MuiTablePagination-actions button": {
              fontSize: "1.6rem",
              backgroundColor: "var(--bg-color)",
              border: " 0.3rem solid #ffffff4d",
            },
            "& .MuiTablePagination-actions button:hover": {
              backgroundColor: "var(--primary-deep)",
            },

            "& .MuiTablePagination-actions button:hover .MuiSvgIcon-root": {
              color: "#fff !important",
            },
          }}
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
        />
      </Box>
    </Paper>
  );
};
ReportPT.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  //   onChangeDate: PropTypes.func.isRequired,
  //   amount: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  currentYear: PropTypes.string,
  onClickCloseBtn: PropTypes.func,
  //   dataSet: PropTypes.array,
  option: PropTypes.array,
  filteredMonthlySales: PropTypes.array,
  monthlySales: PropTypes.array,
  totalAmount: PropTypes.number,
  totalProfit: PropTypes.number,
};

export default ReportPT;
