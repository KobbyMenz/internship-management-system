import { useState } from "react";
import PropTypes from "prop-types";
// import ProductImage from "../../../assets/images/line-md--image-twotone.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  //   TextField,
  Box,
  //   Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../Button";
import SearchBar from "../SeachBar";
import ImageBox from "../ImageBox/ImageBox";
import ToolTip from "../ToolTip/ToolTip";
import parseCurrency from "../../Functions/parseCurrency";
import FormatNumber from "../../Functions/FormatNumber";
//import Button from "../Button";

const PaginationTableWithImage = ({
  columns,
  rows,
  onEdit,
  onDelete,
  onAdd,
  lowStockThreshold,
  // toggleStatus,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const stockThreshold = lowStockThreshold;

  // Filter rows based on search
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

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
      {/* Header section */}
      <Box
        display="flex"
        flexWrap={"wrap"}
        // gap={2}
        rowGap={1}
        columnGap={"20%"}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
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

        <Box
          display="flex"
          gap={1}
          flexGrow={1}
          justifyContent={"flex-end"}
          // flexWrap={"wrap-reverse"}
          alignItems={"center"}
          //   justifyContent={"space-between"}
        >
          <div style={{ flexGrow: "1", width: "30%" }}>
            <SearchBar
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <CustomButton className="add_btn" onClick={onAdd}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clipRule="evenodd"
              />
            </svg>{" "}
            Add
          </CustomButton>
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
                fontWeight: "bold",
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
                    // display: col.field === "id" ? "none" : "",
                    borderLeft: "0.1rem solid var(--table-header)",
                    borderBottom: "none",
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: "bolder",
                  fontSize: "1.5rem",
                  backgroundColor: "var(--primary)",
                  borderLeft: "0.1rem solid var(--table-header)",
                  borderBottom: "none",
                }}
              >
                Actions
              </TableCell>
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
                          // display: col.field === "id" ? "none" : "",
                          borderLeft: "0.1rem solid var(--bg-color)",
                        }}
                        key={col.field}
                      >
                        {/* {row[col.field]}{" "} */}
                        {col.type === "image" ? (
                          <ImageBox
                            background="transparent"
                            src={`${row[col.field]}`}
                            alt={row.name}
                          />
                        ) : (
                          row[col.type === "status" ? "" : col.field]
                        )}

                        {col.type === "status" ? (
                          <span
                            style={{
                              display: "flex",
                              width: "10.5rem",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "0.4rem 1rem",
                              borderRadius: "2rem",
                              color:
                                row[col.field] > stockThreshold
                                  ? "green"
                                  : row[col.field] > 0 &&
                                    row[col.field] <= stockThreshold
                                  ? "#f57600ff"
                                  : row[col.field] === 0
                                  ? "red"
                                  : "",
                              backgroundColor:
                                row[col.field] > stockThreshold
                                  ? "#0080003d"
                                  : row[col.field] > 0 &&
                                    row[col.field] <= stockThreshold
                                  ? "#ff7b004b"
                                  : row[col.field] === 0
                                  ? "#ff000021"
                                  : "",

                              border:
                                row[col.field] > stockThreshold
                                  ? "0.2rem solid #008000a8"
                                  : row[col.field] > 0 &&
                                    row[col.field] <= stockThreshold
                                  ? "0.2rem solid #f57600ba"
                                  : row[col.field] === 0
                                  ? "0.2rem solid #ee0000ff"
                                  : "",

                              borderLeft:
                                row[col.field] > stockThreshold
                                  ? "0.5rem solid #008000a8"
                                  : row[col.field] > 0 &&
                                    row[col.field] <= stockThreshold
                                  ? "0.5rem solid #f57600ba"
                                  : row[col.field] === 0
                                  ? "0.5rem solid #ee0000ff"
                                  : "",

                              borderRight:
                                row[col.field] > stockThreshold
                                  ? "0.5rem solid #008000a8"
                                  : row[col.field] > 0 &&
                                    row[col.field] <= stockThreshold
                                  ? "0.5rem solid #f57600ba"
                                  : row[col.field] === 0
                                  ? "0.5rem solid #ee0000ff"
                                  : "",
                              fontWeight: "600",
                              fontSize: "1.5rem",
                            }}
                          >
                            {row[col.field] > 0 &&
                            row[col.field] <= stockThreshold
                              ? "Low Stock"
                              : row[col.field] === 0
                              ? "Stock Out"
                              : row[col.field] >= stockThreshold
                              ? "In Stock"
                              : ""}
                          </span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    ))}

                    <TableCell
                      sx={{
                        borderBottom: "0.1rem solid var(--bg-color)",
                        borderLeft: "0.1rem solid var(--bg-color)",
                      }}
                    >
                      <Box
                        display="flex"
                        // flexWrap={"wrap"}
                        gap={"0.2rem"}
                        alignItems={"center"}
                      >
                        <ToolTip title="View/Edit">
                          <IconButton
                            sx={{
                              backgroundColor: "#06882d",
                              border: "0.3rem solid #ffffff4d",
                              color: "var(text-color)",
                              "&:hover": { backgroundColor: "#079b33" },
                              width: "3.6rem",
                              height: "3.6rem",
                              // mr: 1,
                            }}
                            onClick={() =>
                              onEdit(
                                row.id,
                                row.name,
                                parseCurrency(row.costPrice),
                                parseCurrency(row.price),
                                row.description,
                                row.categoryName,
                                row.productImage
                              )
                            }
                          >
                            <EditIcon sx={{ fontSize: "1.8rem" }} />
                          </IconButton>
                        </ToolTip>

                        <ToolTip title="Delete">
                          <IconButton
                            sx={{
                              backgroundColor: "#ca0202",
                              border: "0.3rem solid #ffffff4d",
                              color: "var(text-color)",
                              "&:hover": { backgroundColor: "#f52b1cff" },
                              width: "3.6rem",
                              height: "3.6rem",
                            }}
                            onClick={() => onDelete(row.id, row.name)}
                          >
                            <DeleteIcon sx={{ fontSize: "1.8rem" }} />
                          </IconButton>
                        </ToolTip>
                      </Box>
                    </TableCell>
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
PaginationTableWithImage.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  toggleStatus: PropTypes.func,
  lowStockThreshold: PropTypes.number,
};

export default PaginationTableWithImage;
