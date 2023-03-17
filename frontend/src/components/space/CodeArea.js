import { Box } from "@mui/material";

export default function CodeArea() {
  return (
    <Box
      sx={{
        height: "inherit",
        backgroundColor: "background.default",
        pt: 1,
        pl: 1,
        pr: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.secondary",
        }}
      >
        Code area
      </Box>
    </Box>
  );
}
