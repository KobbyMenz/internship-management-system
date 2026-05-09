import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Card from "../Card";

const SalesSkeletonPlaceholder = () => {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      columnGap="2rem"
      rowGap="2rem"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(21rem, 1fr))",
        padding: "1rem 0.5rem",
      }}
    >
      {Array.from(new Array(12)).map((item, index) => (
        <Card key={index}>
          <Box sx={{ width: "100%", p: 1 }}>
            {<Skeleton variant="rounded" width={"100%"} height={140} />}
            {
              <Box sx={{ pt: 0.5, mt: 2 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="60%" />

                {/* button */}
                <Skeleton
                  sx={{
                    mt: 3,
                    borderRadius: "2rem",
                    background: "var(--primary)",
                  }}
                  width="100%"
                  height={45}
                  variant="rounded"
                />
              </Box>
            }
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default SalesSkeletonPlaceholder;
