import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Alert,
  AlertTitle,
  Snackbar,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosConfig from "../../utils/axiosConfig";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { copySpaceId } from "../../utils/copySpaceId";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../../context/ColorModeContext";
import { useTheme } from "@mui/material/styles";
import ActiveUsers from "./ActiveUsers";
import { socket } from "../../scoket";
import ACTIONS from "../../utils/Actions";

function SpaceHeader({ loggedInUser }) {
  const navigate = useNavigate();
  const state = useSelector((state) => state.spaceReducer);
  const dispatch = useDispatch();
  const [loadError, setLoadError] = useState(false);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const handleSave = async () => {
    try {
      await axiosConfig.put(
        `/spaces/${location.pathname.split("/")[2]}`,
        {
          spaceData: state.spaceData,
        },
        {
          headers: loggedInUser?.token
            ? { Authorization: `Bearer ${loggedInUser.token}` }
            : undefined,
        }
      );
      setSuccess(true);
      dispatch({
        type: "updateMessage",
        payload: {
          title: "Saved!",
          data: "This space data is now up to date",
        },
      });
    } catch (e) {
      setLoadError(true);
      dispatch({
        type: "updateMessage",
        payload: {
          title: "Cannot save space data at the moment!",
          data: "Try again later!",
        },
      });
    }
  };

  const handleCopy = () => {
    const { status, message } = copySpaceId(location.pathname.split("/")[2]);
    setSuccess(status);
    dispatch({
      type: "updateMessage",
      payload: message,
    });
  };

  return (
    <>
      <Snackbar
        open={loadError}
        onClose={() => setLoadError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
          <AlertTitle>{state.message.title}</AlertTitle>
          {state.message.data}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
          <AlertTitle>{state.message.title}</AlertTitle>
          {state.message.data}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "space-between",
          alignItems: "center",
          pl: 1,
          pr: 1,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "text.primary",
            fontSize: { xs: 30, sm: 35 },
            fontWeight: 700,
          }}
        >
          CodeCollab.
        </Typography>

        <ActiveUsers activeUsers={state.activeUsers} />

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton sx={{ color: "text.primary" }} onClick={handleCopy}>
            <ContentCopyIcon />
          </IconButton>

          {state.canEdit && (
            <IconButton onClick={handleSave} sx={{ color: "text.primary" }}>
              <SaveIcon />
            </IconButton>
          )}

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={colorMode.toggleColorMode}
              sx={{ color: "text.primary" }}
            >
              {theme.palette.mode === "light" ? (
                <DarkModeIcon />
              ) : (
                <LightModeIcon />
              )}
            </IconButton>

            <Button
              variant="contained"
              onClick={() => {
                socket.emit(ACTIONS.LEAVE, {
                  spaceId: location.pathname.split("/")[2],
                });
                dispatch({ type: "resetSpaceState" });
                loggedInUser?.token ? navigate("/dashboard") : navigate("/");
              }}
            >
              Leave Space
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

export default SpaceHeader;
