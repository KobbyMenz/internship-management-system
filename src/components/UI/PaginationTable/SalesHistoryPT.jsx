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
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
//import CustomButton from "../Button";
import SearchBar from "../SeachBar";
import DateInput from "../DateInput/DateInput";
import Tag from "../Tag/Tag";
import FormatNumber from "../../Functions/FormatNumber";

const SalesHistoryPT = ({ columns, rows, onChangeDate, amount, onChange }) => {
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
        boxShadow: "0rem 0.2rem 1rem rgba(0, 0, 0, 0.25)",
        backgroundColor: "var(--bg-color2)",
        color: "var(--text-color)",
        // fontSize: "1.4rem",
      }}
    >
      <h2 style={{ fontWeight: "500", color: "var(--primary)" }}>
        Sales History
      </h2>
      {/* Header section */}
      <Box
        display="flex"
        flexWrap={"wrap"}
        rowGap={1}
        columnGap={"20%"}
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

          <Tag title={`Amount of Items:`} number={amount} />
        </Box>

        <Box
          display="flex"
          // width={"20%"}
          gap={1}
          flexGrow={1}
          flexWrap={"wrap"}
          alignItems={"center"}
          //   justifyContent={"space-between"}
        >
          <div style={{ flexGrow: "1" }}>
            <SearchBar
              // size="small"
              placeholder="Search by invoice number..."
              // value={value}
              onChange={onChange}
              name="searchBarName"
            />
          </div>

          {/*========== Search date==============*/}
          <div className="searchDate">
            <DateInput
              placeholder="Search by date..."
              onChangeDate={onChangeDate}
              name="searchDateName"
            />
          </div>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table
          stickyHeader
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
                    display: col.type === "salesId" ? "none" : "",
                    borderLeft: "0.1rem solid var(--table-header)",
                    borderBottom: "none",
                  }}
                >
                  {col.headerName}
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
                          display: col.type === "salesId" ? "none" : "",
                          borderLeft: "0.1rem solid var(--bg-color)",
                        }}
                        key={col.field}
                      >
                        {/* {row[col.field]} */}
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
                  sx={{
                    fontSize: "1.5rem",
                    color: "var(--text-color)",
                    border: "0.1rem solid var(--bg-color)",
                  }}
                >
                  Data not found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        sx={{
          fontSize: "1.4rem",
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
    </Paper>
  );
};
SalesHistoryPT.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeDate: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  // value: PropTypes.string,
  // searchBarName: PropTypes.string,
  // searchDateName: PropTypes.string,
};

export default SalesHistoryPT;
