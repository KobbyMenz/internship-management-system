import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const ProfileSkeleton = () => {
  return (
    <Box>
      {Array.from(new Array(1)).map((item, index) => (
        <Box key={index}>
          <Box
            sx={{
              
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(28rem, 1fr))",
              alignItems: "center",
              gap: "2rem",
              padding: "1rem 1.8rem",
              marginTop: "4rem",

              
            }}
          >
            <Box
              width={"100%"}
              display="flex"
              flexDirection="column"
              gap="2rem"
            >
              <Skeleton
                sx={{
                  borderRadius: "1rem",
                  maxWidth: "65rem",
                  marginBottom: "2rem",
                }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{
                  borderRadius: "1rem",
                  maxWidth: "65rem",
                  marginBottom: "2rem",
                }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{
                  borderRadius: "1rem",
                  maxWidth: "65rem",
                  marginBottom: "2rem",
                }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{
                  borderRadius: "1rem",
                  maxWidth: "65rem",
                  marginBottom: "2rem",
                }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              {/* <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "65rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              /> */}
            </Box>

            <Box
            // display="flex"
            // flexDirection="column"
            // justifyContent="center"
            // gap="2rem"
            // alignItems="center"
            >
              {
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={200}
                  sx={{
                    position: "relative",
                    borderRadius: "2rem",
                    zIndex: 1,
                    margin: "0 auto",
                    maxWidth: "40rem",
                  }}
                />
              }

              {/* <Skeleton
                sx={{ borderRadius: "50%", position: "absolute", top: "15%" , left:"50%", transform:"translate(100%, -50%)",zIndex:2}}
                variant="rounded"
                height="15rem"
                width="15rem"
              /> */}
            </Box>
          </Box>

          <Box
            sx={{ mt: 4, borderTop: "2px solid var(--bg-color)" }}
            width={"100%"}
          >
            <Skeleton
              sx={{ borderRadius: "1rem", mb: 2, mt: 1.5, maxWidth: "40rem" }}
              variant="text"
              width="100%"
            />

            <Skeleton
              sx={{ borderRadius: "1rem", mb: 2, maxWidth: "80rem" }}
              variant="rounded"
              height="5rem"
              width="100%"
            />
            <Skeleton
              sx={{ borderRadius: "1rem", mb: 2, maxWidth: "80rem" }}
              variant="rounded"
              height="5rem"
              width="100%"
            />
          </Box>

          <Skeleton
            variant="rounded"
            height="4.5rem"
            sx={{
              borderRadius: "1rem",
              background: "var(--primary)",
              mb: 3,
              mt: 1,
            }}
            width="19rem"
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProfileSkeleton;
