import { Skeleton, Box } from "@mui/material";
import Card from "../Card";

const TableSkeleton = () => (
  <Card style={{ padding: "2rem" }}>
    <Box
      display="flex"
      flexWrap={"wrap"}
      rowGap={1}
      columnGap={"20%"}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Box width="30rem">
        {/*======= text =======*/}
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="60%" />
      </Box>

      <Box
        display="flex"
        gap={1}
        flexGrow={1}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        {/*======= textbox =======*/}
        <Skeleton
          sx={{ borderRadius: "1rem", maxWidth: "85%" }}
          variant="rounded"
          height="5rem"
          width="100%"
        />

        {/*======= button =======*/}
        <Skeleton
          variant="rounded"
          height="4.5rem"
          sx={{ borderRadius: "2rem", background: "var(--nav-bg)" }}
          width="13rem"
        />
      </Box>
    </Box>

    {[...Array(5)].map((_, index) => (
      <Box key={index}>
        <Skeleton
          key={index}
          variant="rounded"
          width="100%"
          height={80}
          sx={{ mb: 1 }}
        />

        <Box
          display="flex"
          gap="0.2rem"
          sx={{ position: "absolute", right: "5rem", marginTop: "-7rem" }}
        >
          <Skeleton
            variant="circular"
            height="3.5rem"
            sx={{
              background: "var(--nav-bg)",
            }}
            width="3.5rem"
          />

          <Skeleton
            variant="circular"
            height="3.5rem"
            sx={{
              background: "var(--nav-bg)",
            }}
            width="3.5rem"
          />
        </Box>
      </Box>
    ))}

    {/* <Skeleton variant="rounded" width={100} height={36} /> */}
  </Card>
);

export default TableSkeleton;
