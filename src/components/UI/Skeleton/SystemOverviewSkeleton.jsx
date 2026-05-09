import { Box, Skeleton } from "@mui/material";

const SystemOverviewSkeleton = () => {
  return (
    <Box
      // container

      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
        wrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: "1rem",
        rowGap: "1rem",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      {Array.from(new Array(8)).map((item, index) => (
        <Box key={index}>
          {
            <Skeleton
              sx={{ borderRadius: "1rem", background: "var(--bg-color)" }}
              variant="rounded"
              width={"100%"}
              height={98}
            />
          }
        </Box>
      ))}
    </Box>
  );
};

export default SystemOverviewSkeleton;
