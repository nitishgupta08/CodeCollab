import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import {
  Box,
  Backdrop,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import SpaceHeader from "../components/space/SpaceHeader";
import CodeArea from "../components/space/CodeArea";
import useAuth from "../hooks/useAuth";
import { socket } from "../scoket";
import ACTIONS from "../utils/Actions";
import { useDispatch, useSelector } from "react-redux";
import useLocalStorage from "../hooks/useLocalStorage";

function Space() {
  const { auth } = useAuth();
  const [loadError, setLoadError] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [socketError, setSocketError] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector((currentState) => currentState.spaceReducer);
  const currentDataRef = useRef(state.currentData);
  const logBudgetRef = useRef(0);
  const lastRemoteUpdateRef = useRef({ clientId: "", seq: 0 });

  const [localUser] = useLocalStorage("user", null);
  const spaceId = useMemo(() => location.pathname.split("/")[2], [location.pathname]);

  const activeSession = auth || localUser;

  const { response, error } = useAxios({
    method: "GET",
    url: `/spaces/${spaceId}`,
    headers: activeSession?.token
      ? { Authorization: `Bearer ${activeSession.token}` }
      : undefined,
  });

  useEffect(() => {
    document.title = state.spaceName.length === 0 ? "Loading..." : state.spaceName;
  }, [state.spaceName]);

  useEffect(() => {
    currentDataRef.current = state.currentData;
  }, [state.currentData]);

  const logDev = useCallback((message, context = {}) => {
    if (!import.meta.env.DEV || logBudgetRef.current > 4) return;
    logBudgetRef.current += 1;
    console.warn(`[Space] ${message}`, context);
  }, []);

  const applyRemoteCode = useCallback((payload) => {
    if (!payload || typeof payload.change !== "string") {
      logDev("Ignoring malformed remote code payload", { payload });
      return;
    }

    if (payload.clientId && payload.clientId === socket.id) {
      return;
    }

    if (
      payload.clientId &&
      typeof payload.seq === "number" &&
      payload.clientId === lastRemoteUpdateRef.current.clientId &&
      payload.seq <= lastRemoteUpdateRef.current.seq
    ) {
      return;
    }

    if (payload.clientId && typeof payload.seq === "number") {
      lastRemoteUpdateRef.current = {
        clientId: payload.clientId,
        seq: payload.seq,
      };
    }

    const current = currentDataRef.current;
    if (!current || current.fileData === payload.change) {
      return;
    }

    dispatch({
      type: "updateCurrentData",
      payload: { ...current, fileData: payload.change },
    });
  }, [dispatch, logDev]);

  const applyRemoteMetadata = useCallback(({ fileLang, fileName }) => {
    if (typeof fileLang !== "string" || typeof fileName !== "string") {
      logDev("Ignoring malformed metadata payload", { fileLang, fileName });
      return;
    }

    dispatch({
      type: "syncFileMetadata",
      payload: { fileLang, fileName },
    });
  }, [dispatch, logDev]);

  useEffect(() => {
    socket.auth = activeSession?.token ? { token: activeSession.token } : {};
    socket.connect();

    const onJoined = (activeUsers) => {
      dispatch({
        type: "updateActiveUsers",
        payload: activeUsers,
      });
    };

    const onSyncCode = (payload) => applyRemoteCode(payload);
    const onSyncCodeV2 = (payload) => applyRemoteCode(payload);
    const onSyncFileMetadata = (payload) => applyRemoteMetadata(payload);

    const onLeft = ({ activeUsers }) => {
      dispatch({
        type: "updateActiveUsers",
        payload: activeUsers,
      });
    };

    const onSpaceError = (message) => {
      setSocketError(message || "Unable to sync in this space");
      setLoadError(true);
    };

    const guestName =
      location.state?.name || activeSession?.user?.name || `Guest-${spaceId.slice(0, 4)}`;

    socket.emit(ACTIONS.JOIN, { spaceId, name: guestName });
    socket.on(ACTIONS.JOINED, onJoined);
    socket.on(ACTIONS.SYNC_CODE, onSyncCode);
    socket.on(ACTIONS.SYNC_CODE_V2, onSyncCodeV2);
    socket.on(ACTIONS.SYNC_FILE_METADATA, onSyncFileMetadata);
    socket.on(ACTIONS.LEFT, onLeft);
    socket.on("space-error", onSpaceError);

    return () => {
      socket.off(ACTIONS.JOINED, onJoined);
      socket.off(ACTIONS.SYNC_CODE, onSyncCode);
      socket.off(ACTIONS.SYNC_CODE_V2, onSyncCodeV2);
      socket.off(ACTIONS.SYNC_FILE_METADATA, onSyncFileMetadata);
      socket.off(ACTIONS.LEFT, onLeft);
      socket.off("space-error", onSpaceError);
      socket.emit(ACTIONS.LEAVE, { spaceId });
      socket.disconnect();
    };
  }, [activeSession?.token, applyRemoteCode, applyRemoteMetadata, dispatch, location.state?.name, spaceId]);

  useEffect(() => {
    dispatch({
      type: "updateTheme",
      payload: localUser ? localUser.user.theme : state.theme,
    });

    if (error !== undefined) {
      dispatch({
        type: "updateMessage",
        payload: {
          title: "Cannot connect to server at the moment!",
          data: "Try again later",
        },
      });
      setLoadError(true);
      return;
    }

    if (response === undefined) return;

    dispatch({ type: "updateSpaceName", payload: response.data.spaceName });
    dispatch({ type: "updateSpaceData", payload: response.data.spaceData });
    dispatch({ type: "updateActiveUsers", payload: response.data.activeUsers });
    dispatch({ type: "updateCanEdit", payload: !!response.data.canEdit });

    dispatch({
      type: "updateCurrentData",
      payload: response.data.spaceData[0],
    });
    dispatch({
      type: "updateLanguage",
      payload: response.data.spaceData[0].fileLang,
    });
    setLoadingScreen(false);
  }, [response, error, dispatch, localUser, state.theme]);

  useEffect(() => {
    if (!state.currentData) {
      return;
    }

    const ind = state.spaceData.findIndex((item) => item._id === state.currentData._id);
    if (ind < 0) {
      return;
    }

    const existing = state.spaceData[ind];
    const unchanged =
      existing?.fileData === state.currentData.fileData &&
      existing?.fileLang === state.currentData.fileLang &&
      existing?.fileName === state.currentData.fileName;

    if (unchanged) {
      return;
    }

    const newSpaceData = [...state.spaceData];
    newSpaceData[ind] = { ...existing, ...state.currentData };

    dispatch({ type: "updateSpaceData", payload: newSpaceData });
  }, [dispatch, state.currentData, state.spaceData]);

  return (
    <>
      <Backdrop
        sx={{
          backgroundColor: "background.default",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
        open={loadingScreen}
      >
        <CircularProgress size={100} />
        <Typography
          variant="h1"
          sx={{ color: "text.primary", fontSize: 35, fontWeight: 700, mt: 5 }}
        >
          Loading Space...
        </Typography>
      </Backdrop>

      <Snackbar
        open={loadError}
        onClose={() => setLoadError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
          <AlertTitle>{state.message.title || "Error"}</AlertTitle>
          {socketError || state.message.data}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ flex: "0 0 auto", p: 1 }}>
          <SpaceHeader loggedInUser={activeSession} />
        </Box>
        <Box sx={{ flex: "1 1 auto", p: 1 }}>
          <CodeArea spaceId={spaceId} />
        </Box>
      </Box>
    </>
  );
}

export default Space;
