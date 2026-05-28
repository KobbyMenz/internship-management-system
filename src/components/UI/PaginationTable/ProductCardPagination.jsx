// PaginatedCards.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid, Box, Pagination } from "@mui/material";
import FormatNumber from "../../Functions/FormatNumber";
import axios from "axios";
import moment from "moment";
import app_api_url from "../../../../APP_API_URL";

const ProductCardPagination = ({
  items,
  CardComponent,
  itemsPerPage = 20,
  onClickHandler,
}) => {
  const [stockThreshold, setStockThreshold] = useState({});
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  useEffect(() => {
    const getSettings = async () => {
      try {
        const response = await axios.get(`${app_api_url}/getSettings`);

        setStockThreshold((prev) => {
          return {
            ...prev,
            lowStockThreshold: +response.data?.lowStockThreshold || 10,
            // highStockThreshold: +response.data?.highStockThreshold || 40,
          };
        });
      } catch (err) {
        console.log(err);
      }
    };
    getSettings();
  }, []);

  return (
    <>
      <Box>
        {/* Grid of Cards */}
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: "repeat(auto-fill, minmax(24rem, 1fr))",
            gap: "1.8rem",
            alignItems: "stretch",
            "@media (max-width: 884px)": {
              gap: "2rem",
              
            },
          }}
        >
          {currentItems.length !== 0 ? (
            currentItems.map((item) => (
              <Grid item key={item.productId}>
                {/* Render existing product Card component */}
                <CardComponent
                  productTagStyle={{
                    background:
                      +item.quantity <= stockThreshold.lowStockThreshold
                        ? "#f57600ff"
                        : "#008000ff",
                  }}
                  stockStatus={
                    moment().diff(
                      moment(item.dateAdded.split(" ")[0]),
                      "days"
                    ) <= 7 &&
                    moment().diff(
                      moment(item.dateAdded.split(" ")[0]),
                      "days"
                    ) >= 0
                      ? "New Arrival"
                      : +item.quantity <= stockThreshold.lowStockThreshold
                      ? "Low Stock"
                      : "In Stock"
                  }
                  productImage={item.productImage}
                  productName={item.productName}
                  categoryName={item.categoryName}
                  quantity={FormatNumber(+item.quantity)}
                  price={+item.price.replace(/,/g, "")}
                  description={
                    item.description !== null ? item.description : ""
                  }
                  onClick={() =>
                    onClickHandler(
                      item.productId,
                      item.productName,
                      item.quantity,
                      item.costPrice.replace(/,/g, ""),
                      item.price.replace(/,/g, ""),
                      item.productImage
                    )
                  }
                />
              </Grid>
            ))
          ) : (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.8rem",
                alignItems: "center",
                marginTop: "1.5rem",
              }}
            >
              No product found
            </p>
          )}
        </Box>

        {/* Pagination Control and color description box*/}
        <Box
          display="flex"
          justifyContent="center"
          columnGap={5}
          rowGap={2}
          mt={3}
          borderTop="0.2rem solid var(--border-color)"
          pt={2}
        >
          {/* Pagination Control */}
          <Pagination
            count={Math.ceil(items.length / itemsPerPage)}
            page={page}
            onChange={handleChange}
            color="var(--primary)"
            sx={{
              button: {
                color: "var(--text-color)",
                fontSize: "1.3rem",
                fontWeight: "600",
                background: "var(--bg-color)",
                border: " 0.3rem solid #ffffff4d",

                "&:hover": { background: "var(--primary)", color: "#fff" },
              },
              ul: {
                "& .Mui-selected": {
                  background: "var(--primary)",
                  color: "#fff",
                },
              },

              "& .Mui-selected": {
                background: "var(--primary)",
                "&:hover": {
                  background: "var(--primary)",
                  color: "#fff",
                },
              },

              "& .MuiPaginationItem-previousNext svg": {
                color: "var(--text-color)",
                fontSize: "1.3rem",
              },
              "& .MuiPaginationItem-previousNext:hover svg": {
                color: "#fff",
              },

              // "& .MuiPaginationItem-root": {
              //   color: "blue", // Change to your desired color
              // },
              // "& .MuiPaginationItem-previousNext": {
              //   color: "red", // Change to your desired color for next/prev
              // },
            }}
          />

          {/* color description box*/}
          <Box display="flex" gap={2} fontSize="1.3rem">
            <Box display="flex" alignItems="center" gap="0.5rem">
              <div
                style={{
                  backgroundColor: "#008000ff",
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "0.2rem",
                }}
              ></div>
              <span>InStock</span>
            </Box>

            <Box display="flex" alignItems="center" gap="0.5rem">
              <div
                style={{
                  backgroundColor: "#f57600ff",
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "0.2rem",
                }}
              ></div>
              <span>Low Stock</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
ProductCardPagination.propTypes = {
  items: PropTypes.array.isRequired,
  CardComponent: PropTypes.elementType.isRequired,
  itemsPerPage: PropTypes.number,
  onClickHandler: PropTypes.func.isRequired,
};
export default ProductCardPagination;
