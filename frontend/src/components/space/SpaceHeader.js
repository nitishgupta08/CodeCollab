import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import ActiveUsers from "./ActiveUsers";

function SpaceHeader({ loggedInUser }) {
  const navigate = useNavigate();
  const handleSave = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pl: 1,
        pr: 1,
      }}
    >
      <Typography
        variant="h1"
        sx={{ color: "text.primary", fontSize: 35, fontWeight: 700 }}
      >
        CodeCollab.
      </Typography>

      {/*<ActiveUsers activeUsers={activeUsers} />*/}

      <Box sx={{ display: "flex" }}>
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
