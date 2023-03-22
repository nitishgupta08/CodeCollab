import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";

function UserSettings({ loggedInUser }) {
  const [newName, setNewName] = useState(loggedInUser.user.name);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mt: 5, ml: 30 }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h2"
          sx={{ color: "text.primary", fontSize: 20, fontWeight: 700, mb: 1 }}
        >
          email.
        </Typography>
        <TextField
          disabled
          name="email"
          value={loggedInUser.user.email}
          sx={{ width: "400px" }}
        />
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h2"
          sx={{ color: "text.primary", fontSize: 20, fontWeight: 700, mb: 1 }}
        >
          name.
        </Typography>
        <Box sx={{ display: "flex" }}>
          <TextField
            disabled
            name="name"
            value={loggedInUser.user.name}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ width: "400px", mr: 2 }}
          />
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h2"
          sx={{ color: "text.primary", fontSize: 20, fontWeight: 700, mb: 1 }}
        >
          change password.
        </Typography>
        <Typography
          variant="h2"
          sx={{ color: "text.primary", fontSize: 20, fontWeight: 700, mb: 1 }}
        >
          favourite lang.
        </Typography>
      </Box>
    </Box>
  );
}

export default UserSettings;
