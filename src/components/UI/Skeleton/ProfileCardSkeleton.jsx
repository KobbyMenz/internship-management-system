import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const ProfileCardSkeleton = () => {
  return (
    <Box>
      {Array.from(new Array(1)).map((item, index) => (
        <Box
          padding="0.4rem 0"
          display="flex"
          alignSelf="self-end"
          alignItems="center"
          justifyContent="center"
          gap="0.8rem"
          flexWrap="nowrap"
          key={index}
        >
          {
            <Box
              width="12rem"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
            </Box>
          }

          {<Skeleton variant="circular" width={35} height={35} />}
        </Box>
      ))}
    </Box>
  );
};

export default ProfileCardSkeleton;
