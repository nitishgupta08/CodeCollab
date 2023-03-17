import React from "react";
import { Avatar, AvatarGroup, Box, Divider, Typography } from "@mui/material";
import uniqolor from "uniqolor";
import { HtmlTooltip } from "../../reuseable";

<HtmlTooltip
  title={
    <React.Fragment>
      {active &&
        active.map((client, id) => {
          return client.userData.email ? (
            <Box sx={{ mb: 1 }} key={id}>
              <Typography
                color="text.primary"
                sx={{ fontSize: 20, fontWeight: 700 }}
              >
                {client.userData.name}
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
                {client.userData.name}
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
    {active &&
      active.map((client, id) => {
        return (
          <Avatar
            key={id}
            sx={{ backgroundColor: uniqolor(client.userData.name).color }}
          >
            {client.userData.name[0]}
          </Avatar>
        );
      })}
  </AvatarGroup>
</HtmlTooltip>;
