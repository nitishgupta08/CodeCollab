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
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect } from "react";
import axiosConfig from "../../utils/axiosConfig";

export default function JoinSpace({
  spaceId,
  dispatch,
  loggedInUser,
  open,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open) {
      dispatch({ type: "updateSpaceId", payload: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleJoin = async () => {
    try {
      await axiosConfig.post(
        `/spaces/${spaceId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${loggedInUser.token}` },
        }
      );

      navigate(`/space/${spaceId}`, {
        state: {
          spaceId,
          name: loggedInUser.user.name,
          email: loggedInUser.user.email,
        },
      });
      dispatch({ type: "handleJoinBackdrop", payload: false });
    } catch (e) {
      // handled in target page through API/socket errors
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch({ type: "handleJoinBackdrop", payload: false })}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}
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
          Enter Space ID.
        </Typography>

        <IconButton
          sx={{ color: "primary.main" }}
          onClick={() =>
            dispatch({ type: "handleJoinBackdrop", payload: false })
          }
        >
          <CloseIcon sx={{ color: "error.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          name="spaceId"
          placeholder="Paste Invite ID"
          value={spaceId}
          onChange={(e) =>
            dispatch({ type: "updateSpaceId", payload: e.target.value })
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="contained" onClick={handleJoin}>
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}
