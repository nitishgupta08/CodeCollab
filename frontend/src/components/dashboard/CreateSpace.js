import { useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { CustomTextField } from "../../reuseable";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";
import axiosConfig from "../../utils/axiosConfig";
import { copySpaceId } from "../../utils/copySpaceId";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";

export default function CreateSpace({
  spaceId,
  spaceName,
  dispatch,
  setError,
  setMessage,
  loggedInUser,
  setSuccess,
  showCreateSpaceBackdrop,
  dashboardDispatch,
}) {
  useEffect(() => {
    if (showCreateSpaceBackdrop) {
      const id = uuidv4();
      dispatch({ type: "updateSpaceId", payload: id });
    }
  }, [showCreateSpaceBackdrop]);

  const handleCreate = () => {
    if (!spaceName) {
      setError(true);
      setMessage({ title: ":(", data: "Name cannot be empty" });
      return;
    }

    axiosConfig
      .post(
        "/spaces",
        { spaceId, spaceName },
        {
          headers: { Authorization: `Bearer ${loggedInUser.token}` },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          dashboardDispatch({ type: "updateListSpaces", payload: res.data });
          dispatch({ type: "handleCreateBackdrop", payload: false });
          dispatch({ type: "updateSpaceName", payload: "" });

          // navigate(`/space/${spaceId}`, {
          //   state: {
          //     spaceId,
          //     name: loggedInUser.user.name,
          //     email: loggedInUser.user.email,
          //   },
          // });
        }
      });
  };

  const handleCopy = () => {
    const { status, message } = copySpaceId(spaceId);
    setSuccess(status);
    setMessage(message);
  };

  return (
    <Box
      sx={{
        minWidth: "30vw",
        backgroundColor: "background.secondary",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "text.primary",
            fontSize: 30,
            fontWeight: 700,
            pb: 4,
          }}
        >
          Provide space name.
        </Typography>

        <IconButton
          sx={{ color: "primary.main", mb: 4 }}
          onClick={() =>
            dispatch({ type: "handleCreateBackdrop", payload: false })
          }
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <CustomTextField
        disabled
        name="spaceid"
        placeholder="Paste Invite ID"
        sx={{ width: "100%", mb: 1 }}
        value={spaceId}
        onChange={(e) =>
          dispatch({ type: "updateSpaceId", payload: e.target.value })
        }
      />

      <CustomTextField
        autoFocus
        name="name"
        placeholder="Enter name"
        sx={{ width: "100%", mb: 2 }}
        value={spaceName}
        onChange={(e) =>
          dispatch({ type: "updateSpaceName", payload: e.target.value })
        }
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            sx={{ height: "43px", mr: 2 }}
            onClick={handleCreate}
          >
            Create
          </Button>

          <Button
            variant="contained"
            sx={{ height: "43px" }}
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
          >
            Space Id
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
