import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";

function SpaceHeader({ loggedInUser }) {
  const navigate = useNavigate();
  const handleSave = () => {};

  return (
    <Box
      sx={{
        height: "inherit",
        backgroundColor: "background.default",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pl: 2,
        pr: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <Typography
          variant="h1"
          sx={{ color: "text.primary", fontSize: 35, fontWeight: 700 }}
        >
          CodeCollab.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {loggedInUser && (
          <IconButton onClick={handleSave} sx={{ color: "text.primary" }}>
            <SaveIcon />
          </IconButton>
        )}

        <Button
          variant="contained"
          sx={{ ml: 1 }}
          onClick={() => {
            loggedInUser ? navigate("/dashboard") : navigate("/");
          }}
        >
          Leave Space
        </Button>
      </Box>
    </Box>
  );
}

export default SpaceHeader;
