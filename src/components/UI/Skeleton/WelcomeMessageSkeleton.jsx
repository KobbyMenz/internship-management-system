import { Box, Skeleton } from "@mui/material";

const WelcomeMessageSkeleton = () => (
  <>
    {/*======= text =======*/}
    <Box
      sx={{
        padding: "2rem 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems:"center",
        flexWrap:"wrap",
        gap:"2rem"
      }}
    >
      <div>
        <Skeleton variant="text" width={"30rem"} />
        <Skeleton variant="text" width="75%" sx={{ marginTop: "1rem" }} />
      </div>

      <Skeleton
        sx={{ borderRadius: "1rem" }}
        variant="rounded"
        width={180}
        height={60}
      />
    </Box>
  </>
);

export default WelcomeMessageSkeleton;
