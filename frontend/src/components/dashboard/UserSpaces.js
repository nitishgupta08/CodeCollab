import React from "react";
import {
  Box,
  Typography,
  Button,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListSpaces from "./ListSpaces";
import CreateSpace from "./CreateSpace";
import SearchIcon from "@mui/icons-material/Search";
import JoinSpace from "./JoinSpace";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

function UserSpaces({
  setMessage,
  setSuccess,
  setError,
  loggedInUser,
  listSpaces,
  originalSpace,
  dispatch,
  showCreateSpaceBackdrop,
  showJoinSpaceBackdrop,
  spaceId,
  spaceName,
}) {
  function searchQuery(searchTerm) {
    if (searchTerm !== "") {
      const filteredSpaces = originalSpace.filter((space) => {
        return (
          space.spaceId.includes(searchTerm) ||
          space.spaceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      dispatch({ type: "updateListSpaces", payload: filteredSpaces });
    } else {
      dispatch({ type: "updateListSpaces", payload: originalSpace });
    }
  }

  return (
    <>
      <CreateSpace
        spaceId={spaceId}
        spaceName={spaceName}
        setError={setError}
        setSuccess={setSuccess}
        setMessage={setMessage}
        loggedInUser={loggedInUser}
        dispatch={dispatch}
        open={showCreateSpaceBackdrop}
      />

      <JoinSpace
        spaceId={spaceId}
        loggedInUser={loggedInUser}
        dispatch={dispatch}
        open={showJoinSpaceBackdrop}
      />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "1200px", minHeight: "70vh", mb: 10, px: 2 }}>
          <Stack
            sx={{
              p: 2,
              pt: 5,
            }}
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
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

            <OutlinedInput
              disabled={!listSpaces}
              size="small"
              sx={{ minWidth: { xs: "100%", md: "30%" } }}
              onChange={(e) => searchQuery(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RocketLaunchIcon />}
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
            </Stack>
          </Stack>

          <ListSpaces
            setMessage={setMessage}
            setSuccess={setSuccess}
            setError={setError}
            loggedInUser={loggedInUser}
            listSpaces={listSpaces}
            dispatch={dispatch}
          />
        </Box>
      </Box>
    </>
  );
}

export default UserSpaces;
