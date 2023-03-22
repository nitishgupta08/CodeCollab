import React from "react";
import { Avatar, AvatarGroup, Box, Divider, Typography } from "@mui/material";
import uniqolor from "uniqolor";
import { HtmlTooltip } from "../../reuseable";

export default function ActiveUsers({ activeUsers }) {
  console.log(activeUsers);
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          {activeUsers.length > 0 &&
            activeUsers.map((user, id) => {
              return user.email ? (
                <Box sx={{ mb: 1 }} key={id}>
                  <Typography
                    color="text.primary"
                    sx={{ fontSize: 20, fontWeight: 700 }}
                  >
                    {user.name}
                  </Typography>
                  <Typography color="text.primary" sx={{ opacity: 0.7 }}>
                    can edit this space.
                  </Typography>
                  <Divider sx={{ backgroundColor: "text.primary" }} />
                </Box>
              ) : (
                <Box sx={{ mb: 1 }} key={id}>
                  <Typography
                    color="text.primary"
                    sx={{ fontSize: 20, fontWeight: 700 }}
                  >
                    {user.name}
                  </Typography>
                  <Typography color="text.primary" sx={{ opacity: 0.7 }}>
                    can only view this space.
                  </Typography>
                  <Divider sx={{ backgroundColor: "text.primary" }} />
                </Box>
              );
            })}
        </React.Fragment>
      }
    >
      <AvatarGroup max={6}>
        {activeUsers.length > 0 &&
          activeUsers.map((user, id) => {
            return (
              <Avatar
                key={id}
                // sx={{ backgroundColor: uniqolor(user.name).color }}
              >
                {user.name[0]}
              </Avatar>
            );
          })}
      </AvatarGroup>
    </HtmlTooltip>
  );
}
