import React, { useReducer } from "react";
import { Box, Typography, Button, Backdrop } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListSpaces from "./ListSpaces";
import uniqid from "uniqid";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CreateSpace from "./CreateSpace";
import JoinSpace from "./JoinSpace";

const initialState = {
  spaceId: "",
  spaceName: "",
  showCreateSpaceBackdrop: false,
  showJoinSpaceBackdrop: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "updateSpaceId":
      return { ...state, spaceId: action.payload };
    case "updateSpaceName":
      return { ...state, spaceName: action.payload };
    case "handleCreateBackdrop":
      return { ...state, showCreateSpaceBackdrop: action.payload };
    case "handleJoinBackdrop":
      return { ...state, showJoinSpaceBackdrop: action.payload };
    default:
      throw new Error();
  }
}

function UserSpaces({
  setMessage,
  setSuccess,
  setError,
  loggedInUser,
  listSpaces,
  dashboardDispatch,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const spaceData = [
    {
      id: uniqid(),
      fileName: "Untitled-1",
      fileData: "Write your code here",
      lang: 0,
    },
  ];

  return (
    <>
      <Backdrop
        sx={{
          zIndex: 2,
          backdropFilter: "blur(5px)",
        }}
        open={state.showCreateSpaceBackdrop}
      >
        <CreateSpace
          spaceId={state.spaceId}
          spaceName={state.spaceName}
          setError={setError}
          setSuccess={setSuccess}
          setMessage={setMessage}
          loggedInUser={loggedInUser}
          dispatch={dispatch}
          dashboardDispatch={dashboardDispatch}
          showCreateSpaceBackdrop={state.showCreateSpaceBackdrop}
        />
      </Backdrop>

      <Backdrop
        sx={{ zIndex: 2, backdropFilter: "blur(5px)" }}
        open={state.showJoinSpaceBackdrop}
      >
        <JoinSpace
          spaceId={state.spaceId}
          loggedInUser={loggedInUser}
          dispatch={dispatch}
          showJoinSpaceBackdrop={state.showJoinSpaceBackdrop}
        />
      </Backdrop>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ minWidth: "60vw", minHeight: "70vh", mb: 10 }}>
          <Box
            sx={{
              p: 2,
              pt: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 700,
                pr: 5,
                color: "text.primary",
              }}
            >
              Your spaces.
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<RocketLaunchIcon />}
                sx={{ mr: 2 }}
                onClick={() =>
                  dispatch({ type: "handleJoinBackdrop", payload: true })
                }
              >
                Join a space
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  dispatch({ type: "handleCreateBackdrop", payload: true })
                }
              >
                Create a new space
              </Button>
            </Box>
          </Box>

          <ListSpaces
            setMessage={setMessage}
            setSuccess={setSuccess}
            setError={setError}
            loggedInUser={loggedInUser}
            listSpaces={listSpaces}
            dashboardDispatch={dashboardDispatch}
          />
        </Box>
      </Box>
    </>
  );
}

export default UserSpaces;
