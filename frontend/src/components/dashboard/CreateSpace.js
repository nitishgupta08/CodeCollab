import { useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  open,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open) {
      const id = uuidv4();
      dispatch({ type: "updateSpaceId", payload: id });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
          dispatch({ type: "updateListSpaces", payload: res.data });
          dispatch({ type: "updateOriginalSpaces", payload: res.data });
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
    <Dialog
      open={open}
      onClose={() => dispatch({ type: "handleCreateBackdrop", payload: false })}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}
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
          sx={{ color: "primary.main" }}
          onClick={() =>
            dispatch({ type: "handleCreateBackdrop", payload: false })
          }
        >
          <CloseIcon sx={{ color: "error.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            disabled
            name="spaceId"
            placeholder="Paste Invite ID"
            value={spaceId}
            onChange={(e) =>
              dispatch({ type: "updateSpaceId", payload: e.target.value })
            }
          />

          <TextField
            autoFocus
            name="name"
            placeholder="Enter name"
            value={spaceName}
            onChange={(e) =>
              dispatch({ type: "updateSpaceName", payload: e.target.value })
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          sx={{ mr: 1 }}
          onClick={handleCreate}
        >
          Create
        </Button>

        <Button
          variant="outlined"
          sx={{ height: "43px" }}
          onClick={handleCopy}
          startIcon={<ContentCopyIcon />}
        >
          Space Id
        </Button>
      </DialogActions>
    </Dialog>
  );
}
