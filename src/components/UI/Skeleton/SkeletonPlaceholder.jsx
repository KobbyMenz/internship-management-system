import { Skeleton, Box } from "@mui/material";

const SkeletonPlaceholder = () => (
  <>
    <Box>
      {[...Array(6)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width="100%"
          height={40}
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  </>
);

export default SkeletonPlaceholder;
