import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const SettingsSkeleton = () => {
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
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
            </Box>

            <Box
              width={"100%"}
              display="flex"
              flexDirection="column"
              gap="2rem"
            >
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              borderTop: "2px solid var(--bg-color)",
              mt: 4,
            }}
            padding="1.5rem 0"
            key={index}
          >
            <Box
              width={"100%"}
              display="flex"
              flexDirection="column"
              gap="2rem"
              mt={4}
            >
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
            </Box>

            <Box
              width={"100%"}
              display="flex"
              flexDirection="column"
              gap="2rem"
              mt={4}
            >
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
              <Skeleton
                sx={{ borderRadius: "1rem", maxWidth: "75rem" }}
                variant="rounded"
                height="5rem"
                width="100%"
              />
            </Box>
          </Box>

          <Box display="flex" gap="1rem" justifyContent="right">
            <Skeleton
              variant="rounded"
              height="4.5rem"
              sx={{
                borderRadius: "2rem",
                background: "var(--nav-bg)",
                mb: 3,
                mt: 1,
              }}
              width="15rem"
            />

            <Skeleton
              variant="rounded"
              height="4.5rem"
              sx={{
                borderRadius: "2rem",
                background: "var(--nav-bg)",
                mb: 3,
                mt: 1,
              }}
              width="15rem"
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SettingsSkeleton;
