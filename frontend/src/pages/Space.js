import { useEffect, useReducer, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import {
  Box,
  Backdrop,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import SpaceHeader from "../components/space/SpaceHeader";
import CodeArea from "../components/space/CodeArea";
import useAuth from "../hooks/useAuth";
import { socket } from "../scoket";
import ACTIONS from "../utils/Actions";

const initialState = {
  spaceData: [],
  loadingScreen: true,
  spaceName: "",
  activeUsers: [],
  editorTheme: "",
  successSnackbar: false,
  failSnackbar: false,
  message: { title: "", data: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "updateSpaceData":
      return { ...state, spaceData: action.payload };
    case "removeLoadingScreen":
      return { ...state, loadingScreen: false };
    case "updateSpaceName":
      return { ...state, spaceName: action.payload };
    case "updateEditorTheme":
      return { ...state, editorTheme: action.payload };
    case "updateSuccess":
      return { ...state, successSnackbar: action.payload };
    case "updateFail":
      return { ...state, failSnackbar: action.payload };
    case "updateMessage":
      return { ...state, message: action.payload };
    case "updateActiveUsers":
      return { ...state, activeUsers: action.payload };
    default:
      throw new Error();
  }
}

function Space() {
  const { auth, setAuth } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();

  const { response, error } = useAxios({
    method: "GET",
    url: `/spaces/${location.pathname.split("/")[2]}`,
  });

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.emit(ACTIONS.JOIN, {
      spaceId: location.pathname.split("/")[2],
      name: location.state.name,
      email: location.state.email,
    });

    socket.on(ACTIONS.JOINED, (activeUsers) => {
      dispatch({
        type: "updateActiveUsers",
        payload: activeUsers,
      });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ change }) => {
      dispatch({ type: "updateSpaceData", payload: {...state.spaceData, fileData: change}});
    });
  }, []);

  useEffect(() => {
    if (error !== undefined) {
      // Show feedback to user
      console.log(error.response.data);
      return;
    }

    if (response === undefined) return;

    dispatch({ type: "updateSpaceName", payload: response.data.spaceName });
    dispatch({ type: "updateSpaceData", payload: response.data.spaceData[0] });
    dispatch({ type: "removeLoadingScreen", payload: false });
  }, [response, error]);

  return (
    <>
      <Backdrop
        sx={{
          backgroundColor: "background.default",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
        open={state.loadingScreen}
      >
        <CircularProgress size={100} />
        <Typography
          variant="h1"
          sx={{ color: "text.primary", fontSize: 35, fontWeight: 700, mt: 5 }}
        >
          Loading Space...
        </Typography>
      </Backdrop>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ flex: "0 0 auto", p: 1 }}>
          <SpaceHeader loggedInUser={auth} />
        </Box>
        <Box sx={{ flex: "1 1 auto", p: 1 }}>
          <CodeArea
            spaceData={state.spaceData}
            spaceName={state.spaceName}
            spaceId={location.pathname.split("/")[2]}
          />
        </Box>
      </Box>
    </>
  );
}

export default Space;
