import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosConfig from "../../utils/axiosConfig";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { copySpaceId } from "../../utils/copySpaceId";
// import { socket } from "../../scoket";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../../context/ColorModeContext";
import { useTheme } from "@mui/material/styles";

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
      await axiosConfig.put(`/spaces/${location.pathname.split("/")[2]}`, {
        spaceData: state.spaceData,
      });
    } catch (e) {
      setLoadError(true);
      dispatch({
        type: "updateMessage",
        payload: {
          title: "Cannot save project data at the moment!",
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
          <IconButton sx={{ color: "text.primary" }} onClick={handleCopy}>
            <ContentCopyIcon />
          </IconButton>

          {loggedInUser && (
            <IconButton onClick={handleSave} sx={{ color: "text.primary" }}>
              <SaveIcon />
            </IconButton>
          )}
          <Box>
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
              sx={{ ml: 1, mr: 1 }}
              onClick={() => {
                dispatch({ type: "resetSpaceState" });
                loggedInUser ? navigate("/dashboard") : navigate("/");
              }}
            >
              Leave Space
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SpaceHeader;
