import { useState } from "react";
import PropTypes from "prop-types";
import CloseLockIcon from "../../UI/Icons/CloseLockIcon";
import OpenLockIcon from "../../UI/Icons/OpenLockIcon";
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
  Box,
  Typography,
  // colors,
} from "@mui/material";
//  import EditIcon from "../Icons/"
// ";
import DeleteIcon from "../Icons/DeleteIcon";
import CustomButton from "../Button/Button";
import SearchBar from "../SearchBar/SeachBar";
import ImageBox from "../ImageBox/ImageBox";
import ToolTip from "../ToolTip/ToolTip";
//import AddIcon from "../Icons/AddIcon";
import FormatNumber from "../../../Functions/FormatNumber";
import AddUserIcon from "../Icons/AddIcon";
import EditIcon from "../Icons/EditIcon";
//import Button from "../Button";

const ManageUserPT = ({
  columns,
  rows,
  onEdit,
  onDelete,
  onAdd,
  toggleStatus,
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
    event.preventDefault();
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
        border: "none",
        borderRadius: "2rem",
        boxShadow: "0rem 0.2rem 1rem rgba(0, 0, 0, 0.25)",

        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        // fontSize: "1.4rem",

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
          Number of Items: {FormatNumber(filteredRows.length)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexGrow: "1",
            justifyContent: "flex-end",
            alignItems: "center",
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
          <div style={{ flexGlow: "1", width: "65%" }}>
            <SearchBar
              // size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <CustomButton className="add_btn" onClick={onAdd}>
            <AddUserIcon /> Add
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
                    display:
                      col.type === "userName" ||
                      col.type === "role" ||
                      col.type === "photo"
                        ? "none"
                        : "",
                    borderLeft: "0.1rem solid var(--table-header)",
                    borderBottom: "none",
                  }}
                >
                  {col.type === "userName" ? "" : col.headerName}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: "bolder",
                  fontSize: "1.5rem",
                  backgroundColor: "var(--primary)",
                  // borderLeft: "0.1rem solid var(--table-header)",
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
                    // sx={{
                    //   "&:nth-of-type(odd)": {
                    //     backgroundColor: "var(--table-strip)",
                    //   },
                    //   "&:hover": { backgroundColor: "var(--hover-color)" },
                    // }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        sx={{
                          fontSize: "1.5rem",
                          color: "var(--text-color)",
                          borderTop: "0.1rem solid var(--primary)",
                          display:
                            col.type === "userName" ||
                            col.type === "role" ||
                            col.type === "photo"
                              ? "none"
                              : "",
                          // borderLeft: "0.1rem solid var(--bg-color)",
                        }}
                        key={col.field}
                      >
                        {/* {row[col.field]}{" "} */}
                        {col.type === "image" ? (
                          <ImageBox
                            // {product.productImage ? product.productImage : ProductImage}
                            src={`${row[col.field]}`}
                            alt={row.name}
                          />
                        ) : (
                          row[
                            col.type === "status" || col.type === "userName"
                              ? ""
                              : col.field
                          ]
                        )}

                        {col.type === "status" ? (
                          <span
                            style={{
                              display: "flex",
                              width: "10rem",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "0.4rem 1.5rem",
                              borderRadius: "2rem",
                              color:
                                row[col.field] === "Enabled"
                                  ? "green"
                                  : row[col.field] === "Disabled"
                                    ? "#ee0000ff"
                                    : "",
                              backgroundColor:
                                row[col.field] === "Enabled"
                                  ? "#0080003d"
                                  : row[col.field] === "Disabled"
                                    ? "#ff000021"
                                    : "#0080003d",

                              border:
                                row[col.field] === "Enabled"
                                  ? "0.2rem solid #00800084"
                                  : "0.2rem solid #ee0000ff",

                              borderLeft:
                                row[col.field] === "Enabled"
                                  ? "0.5rem solid #00800084"
                                  : "0.5rem solid #ee0000ff",

                              borderRight:
                                row[col.field] === "Enabled"
                                  ? "0.5rem solid #00800084"
                                  : "0.5rem solid #ee0000ff",

                              fontWeight: "600",
                              fontSize: "1.5rem",
                            }}
                          >
                            {row[col.field]}
                          </span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    ))}

                    <TableCell
                      sx={{
                        borderTop: "0.1rem solid var(--primary)",
                        // borderLeft: "0.1rem solid var(--bg-color)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <ToolTip
                          title={
                            row.userStatus === "Disabled"
                              ? "Enable Account"
                              : "Disable Account"
                          }
                        >
                          <IconButton
                            sx={{
                              backgroundColor: "var(--primary)",
                              border: "0.3rem solid #ffffff4d",
                              borderRadius: "50%",
                              color: "var(bg-color)",
                              "&:hover": {
                                backgroundColor: "var(--primary)",
                              },
                              // ml: 1,
                            }}
                            onClick={() =>
                              toggleStatus
                                ? toggleStatus(row.id, row.userStatus, row.name)
                                : null
                            }
                          >
                            {row.userStatus === "Disabled" ? (
                              <OpenLockIcon color="var(--bg-color)" />
                            ) : (
                              <CloseLockIcon color="var(--bg-color)" />
                            )}
                          </IconButton>
                        </ToolTip>

                        <ToolTip title="View/Edit">
                          <IconButton
                            sx={{
                              backgroundColor: "#06882dff",
                              border: "0.3rem solid #ffffff4d",
                              borderRadius: "50%",
                              color: "var(text-color)",
                              "&:hover": { backgroundColor: "#079b33" },
                              width: "4rem",
                              height: "4rem",
                              // marginRight:"0.5rem"
                              // mr: 1,
                            }}
                            onClick={() =>
                              onEdit(
                                row.id,
                                row.image,
                                row.name,
                                // row.userName,
                                row.email,
                                row.contact,
                                row.role,
                              )
                            }
                          >
                            <EditIcon style={{ color: "#fff" }} />
                          </IconButton>
                        </ToolTip>

                        <ToolTip title="Delete">
                          <IconButton
                            sx={{
                              backgroundColor: "#ca0202",
                              border: "0.3rem solid #ffffff4d",
                              borderRadius: "50%",
                              color: "var(text-color)",
                              "&:hover": { backgroundColor: "#f52b1cff" },
                              width: "4rem",
                              height: "4rem",
                            }}
                            onClick={() => onDelete(row.id)}
                          >
                            <DeleteIcon
                              style={{ height: "4rem", color: "#fff" }}
                            />
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
                  {" "}
                  Data not found{" "}
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
            borderRadius: "1rem",
          },
          // "& .MuiTablePagination-select:hover": {
          //   backgroundColor: "var(--secondary)",
          // },


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
ManageUserPT.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  toggleStatus: PropTypes.func,
};

export default ManageUserPT;
