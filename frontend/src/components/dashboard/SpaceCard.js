import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { copySpaceId } from "../../utils/copySpaceId";
import axiosConfig from "../../utils/axiosConfig";

export default function SpaceCard({
  item,
  loggedInUser,
  setMessage,
  setSuccess,
  setError,
  dashboardDispatch,
}) {
  const date = new Date(item.createdAt);
  const navigate = useNavigate();

  const handleDelete = () => {
    axiosConfig
      .delete(`/spaces/${item.spaceId}`, {
        headers: { Authorization: `Bearer ${loggedInUser.token}` },
      })
      .then((res) => {
        if (res.status === 201) {
          dashboardDispatch({ type: "updateListSpaces", payload: res.data });
          setMessage({
            title: "Space deleted",
            data: `${item.spaceName} deleted`,
          });
          setSuccess(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage({
          title: "Cannot delete space",
          data: "Please try again later.",
        });
        setError(true);
      });
  };

  const goToSpace = () => {
    navigate(`/space/${item.spaceId}`, {
      state: {
        spaceId: item.spaceId,
        name: loggedInUser.user.name,
        email: loggedInUser.user.email,
      },
    });
  };

  const handleCopy = () => {
    const { status, message } = copySpaceId(item.spaceId);
    setSuccess(status);
    setMessage(message);
  };

  const handleEdit = () => {};

  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1,
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.87)",
        backgroundColor: "grey.900",
        borderRadius: 4,
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          sx={{ fontSize: 20, fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          {item.spaceName}
        </Typography>

        <Typography
          variant="h5"
          sx={{ fontSize: 15, opacity: "0.8", mb: 2, color: "text.primary" }}
        >
          {item.spaceId}
        </Typography>

        <Typography variant="p" sx={{ fontSize: 11, color: "text.primary" }}>
          Created at: {date.toDateString()} {date.toLocaleTimeString()}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton sx={{ color: "text.primary" }} onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton sx={{ color: "error.main" }} onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>

        <IconButton sx={{ color: "text.primary" }} onClick={handleCopy}>
          <ContentCopyIcon />
        </IconButton>

        <IconButton sx={{ color: "success.main" }} onClick={goToSpace}>
          <RocketLaunchIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
