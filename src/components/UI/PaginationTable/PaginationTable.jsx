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
  IconButton,
  TablePagination,
  //   TextField,
  Box,
  //   Button,
  Typography,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
//import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

import CustomButton from "../Button/Button";
import SearchBar from "../SearchBar/SeachBar";
import ToolTip from "../ToolTip/ToolTip";
import FormatNumber from "../../../Functions/FormatNumber";
// import AddIcon from "../Icons/AddIcon";
import AddUserIcon from "../Icons/AddIcon";
import ImageBox from "../ImageBox/ImageBox";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";
//import defaultPhoto from "../../../assets/images/profilePicture.png";

const PaginationTable = ({
  columns,
  rows,
  onEdit,
  onDelete,
  onAdd,
  addButton,
  buttonStyle,
  placeholder,
  customHeaderButtons,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Filter rows based on search
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //column has candidate name and id, hide id column and use id value to display candidate name
  const hasCandidateNameColumn = columns.some(
    (col) => col.type === "candidateName",
  );

  return (
    <Paper
      sx={{
        pr: 2,
        pl: 2,
        pt: 2,
        border: "none",
        borderRadius: "2rem",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        // Mobile responsive
        "@media (max-width: 600px)": {
          pr: 1,
          pl: 1,
          pt: 1,
        },
        // Tablet responsive
        "@media (max-width: 768px)": {
          pr: 1.5,
          pl: 1.5,
          pt: 1.5,
        },
      }}
    >
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          rowGap: "1rem",
          columnGap: "20%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          // Mobile responsive
          "@media (max-width: 600px)": {
            columnGap: "10%",
            rowGap: 0.5,
          },
          // Tablet responsive
          "@media (max-width: 768px)": {
            columnGap: "15%",
            rowGap: 0.75,
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bolder",
            fontSize: "1.5rem",
            color: "var(--text-color)",
            // Mobile responsive
            "@media (max-width: 600px)": {
              fontSize: "1.1rem",
            },
            // Tablet responsive
            "@media (max-width: 768px)": {
              fontSize: "1.3rem",
            },
          }}
        >
          Number of {hasCandidateNameColumn ? "candidates" : "voters"}:{" "}
          {FormatNumber(filteredRows.length)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexGrow: "1",
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: "wrap-reverse",
            // Mobile responsive
            "@media (max-width: 600px)": {
              gap: 0.5,
            },
            // Tablet responsive
            "@media (max-width: 768px)": {
              gap: 0.75,
            },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              width: "65%",
              "@media (max-width: 600px)": {
                width: "100%",
              },
              "@media (max-width: 768px)": {
                width: "80%",
              },
            }}
          >
            <SearchBar
              // size="small"
              placeholder={placeholder || "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          {customHeaderButtons && (
            <Box sx={{ display: "flex", gap: "1", alignItems: "center" }}>
              {customHeaderButtons}
            </Box>
          )}

          <CustomButton style={buttonStyle} className="add_btn" onClick={onAdd}>
            <AddUserIcon />

            {addButton || "Add"}
          </CustomButton>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table
          stickyHeader
          sx={{
            borderTop: "0.1rem solid var(--primary)",
            borderRight: "0.1rem solid var(--primary)",
            borderLeft: "0.1rem solid var(--primary)",
            borderBottom: "0.1rem solid var(--primary)",
            borderRadius: "2rem",
            overflow: "hidden",
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
                    // background:
                    //   "linear-gradient(135deg, var(--primary-deep) 0%, var(--primary) 100%)",
                    borderLeft: "0.1rem solid var(--table-header)",
                    borderBottom: "none",
                    display: col.field === "image" ? "none" : "",
                    //     : "table-cell",
                    // Mobile responsive
                    "@media (max-width: 600px)": {
                      fontSize: "0.9rem",
                      padding: "0.8rem 0.4rem",
                    },
                    // Tablet responsive
                    "@media (max-width: 768px)": {
                      fontSize: "1.2rem",
                      padding: "1rem 0.8rem",
                    },
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
                  // Mobile responsive
                  "@media (max-width: 600px)": {
                    fontSize: "0.9rem",
                    padding: "0.8rem 0.4rem",
                  },
                  // Tablet responsive
                  "@media (max-width: 768px)": {
                    fontSize: "1.2rem",
                    padding: "1rem 0.8rem",
                  },
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
                    // sx={{
                    //   "&:nth-of-type(odd)": {
                    //     backgroundColor: "var(--table-strip)",
                    //   },
                    //   "&:hover": { backgroundColor: "var(--hover-color)" },
                    // }}
                    // sx={{
                    //   "&:nth-of-type(odd)": {
                    //     backgroundColor: "var(--bg-color2)",
                    //   },
                    //   "&:hover": { backgroundColor: "var(--bg-color2)" },
                    // }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        sx={{
                          fontSize: "1.5rem",
                          color: "var(--text-color)",
                          borderTop: "1px solid var(--primary)",
                          display: col.field === "image" ? "none" : "",
                          // borderLeft: "0.1rem solid var(--bg-color2)",

                          // display:
                          //   hasCandidateNameColumn && col.field === "id"
                          //     ? "none"
                          //     : "table-cell",
                          // Mobile responsive
                          "@media (max-width: 600px)": {
                            fontSize: "0.9rem",
                            padding: "8px 4px",
                          },
                          // Tablet responsive
                          "@media (max-width: 768px)": {
                            fontSize: "1.2rem",
                            padding: "10px 8px",
                          },
                        }}
                        key={col.field}
                      >
                        {/* {row[col.field]} */}
                        {col.type === "image" ? (
                          <ImageBox
                            // background="transparent"
                            src={`${row[col.field]}`}
                            alt="Photo"
                          />
                        ) : (
                          row[col.type === "status" ? "" : col.field]
                        )}
                      </TableCell>
                    ))}

                    <TableCell
                      sx={{
                        borderTop: "1px solid var(--primary)",
                        // borderLeft: "0.1rem solid var(--bg-color2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <ToolTip title="View/Edit">
                          <IconButton
                            sx={{
                              width: "4rem",
                              height: "4rem",
                              backgroundColor: "#06882d",
                              color: "var(--text-color)",
                              "&:hover": { backgroundColor: "#079b33" },
                              border: "0.3rem solid #ffffff4d",
                              borderRadius: "50%",
                              // mr: 1,
                            }}
                            onClick={() =>
                              onEdit(
                                row.id,
                                row.image,
                                row.name,
                                row.dob,
                                row.position,
                              )
                            }
                          >
                            <EditIcon style={{ color: "#fff" }} />
                          </IconButton>
                        </ToolTip>

                        <ToolTip title="Delete">
                          <IconButton
                            sx={{
                              width: "4rem",
                              height: "4rem",
                              border: "0.3rem solid #ffffff4d",
                              borderRadius: "50%",
                              backgroundColor: "var(--danger)",
                              color: "var(--text-color)",
                              "&:hover": {
                                backgroundColor: "var(--danger-hover)",
                              },
                            }}
                            onClick={() => onDelete(row.id)}
                          >
                            <DeleteIcon style={{ color: "#fff" }} />
                          </IconButton>
                        </ToolTip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  sx={{
                    fontSize: "1.5rem",
                    color: "var(--text-color)",
                    border: "0.1rem solid var(--bg-color2)",
                  }}
                >
                  No data added yet.
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
            backgroundColor: "var(--primary)",
            color: "#fff",
            borderRadius:"1rem"
          },

          "& .MuiSvgIcon-root": {
            fontSize: "1.6rem",
            color: "#fff !important",
          },

          "& .MuiTablePagination-actions": {
            fontSize: "1.6rem",
          },
          "& .MuiTablePagination-actions button": {
            fontSize: "1.6rem",
            backgroundColor: "var(--primary)",
            border: " 0.3rem solid #ffffff4d",
            marginRight: "0.5rem",
          },
          "& .MuiTablePagination-actions button:hover": {
            backgroundColor: "var(--secondary)",
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
PaginationTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  addButton: PropTypes.string,
  buttonStyle: PropTypes.object,
  placeholder: PropTypes.string,
};

export default PaginationTable;
