import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { CustomTextField } from "../../reuseable";

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
        <CustomTextField
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
          <CustomTextField
            disabled
            name="name"
            value={loggedInUser.user.name}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ width: "400px", mr: 2 }}
          />
          )}
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
