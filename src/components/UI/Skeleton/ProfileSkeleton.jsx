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
              gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
            padding="1.5rem 0"
          >
            <Box
              width={"100%"}
              display="flex"
              flexDirection="column"
              gap="2rem"
            >
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "65rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "65rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "65rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "65rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "65rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              gap="2rem"
              alignItems="center"
            >
              {<Skeleton variant="rounded" width={180} height={200} />}

              <Skeleton
                sx={{ borderRadius: "1rem" }}
                variant="rounded"
                height="5rem"
                width="30rem"
              />

              <Box display="flex" gap="1rem">
                <Skeleton
                  variant="rounded"
                  height="4.5rem"
                  sx={{ borderRadius: "2rem", background: "var(--nav-bg)" }}
                  width="13rem"
                />

                <Skeleton
                  variant="rounded"
                  height="4.5rem"
                  sx={{ borderRadius: "2rem", background: "#bd2207ef" }}
                  width="13rem"
                />
              </Box>
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
              borderRadius: "2rem",
              background: "var(--nav-bg)",
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
