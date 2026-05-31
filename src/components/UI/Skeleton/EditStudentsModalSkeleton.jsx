import { Box, Skeleton } from "@mui/material";
import Card from "../Card/Card";

const EditStudentsModalSkeleton = () => {
  return (
    <Card style={{ padding: "1.5rem" }}>
      {/* header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        {/* <Skeleton variant="text" width={220} /> */}
        {/* <Skeleton variant="circular" width={36} height={36} /> */}
      </Box>

      {/* body: avatar + two columns of fields */}
      <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        {/* fields */}
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
          </Box>
        </Box>
      </Box>

      {/* notes / long text */}
      <Box sx={{ marginTop: "1rem" }}>
        {/* <Skeleton variant="text" width="40%" /> */}
        {/* <Skeleton variant="rounded" height={80} sx={{ mt: 1 }} /> */}
      </Box>

      {/* actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          marginTop: "1.25rem",
        }}
      >
         <Skeleton variant="rounded" width={100} height={44} />
        <Skeleton variant="rounded" width={100} height={44} />
        <Skeleton variant="rounded" width={100} height={44} />
      </Box>
    </Card>
  );
};

export default EditStudentsModalSkeleton;
