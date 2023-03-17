import React, { useContext, useState, useEffect, useReducer } from "react";
import { Box, Typography, Button, Grid, Tabs, Tab } from "@mui/material";
import { UserContext } from "../context/UserContext";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import UserSpaces from "../components/dashboard/UserSpaces";
import UserSettings from "../components/dashboard/UserSettings";
import ErrorSnackbar from "../components/ErrorSnackbar";
import SuccessSnackbar from "../components/SuccessSnackbar";
import Profile from "../components/dashboard/Profile";
import { useAxios } from "../hooks/useAxios";
import useLocalStorage from "../hooks/useLocalStorage";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const initialState = {
  value: 0,
  listSpace: undefined,
};

function reducer(state, action) {
  switch (action.type) {
    case "updateValue":
      return { ...state, value: action.payload };
    case "updateListSpaces":
      return { ...state, listSpaces: action.payload };
    default:
      throw new Error();
  }
}

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState({ title: "", data: "" });
  const { response, error: responseError } = useAxios({
    method: "GET",
    url: "/spaces",
    headers: { Authorization: `Bearer ${loggedInUser.token}` },
  });

  useEffect(() => {
    if (responseError !== undefined) {
      setMessage({
        title: "error!",
        data: "Can't get your spaces. Try again later!",
      });
      setError(true);
      return;
    }

    if (response === undefined) return;

    dispatch({ type: "updateListSpaces", payload: response.data });
  }, [response]);

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate("/", { replace: true });
  };

  return (
    <>
      <ErrorSnackbar
        open={error}
        close={setError}
        title={message.title}
        message={message.data}
      />
      <SuccessSnackbar
        open={success}
        close={setSuccess}
        title={message.title}
        message={message.data}
      />

      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          display: "flex",
          zIndex: 1,
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: 50, fontWeight: 700, p: 1, color: "text.primary" }}
        >
          CodeCollab.
        </Typography>
        <Button
          variant="contained"
          sx={{ m: 3 }}
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <Grid container sx={{ minHeight: "100vh" }}>
        <Grid item xs={12} sx={{ height: "30vh" }}>
          <Box
            sx={{
              height: "inherit",
              backgroundColor: "background.default",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Profile loggedInUser={loggedInUser} />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                ml: "auto",
                mr: "auto",
              }}
            >
              <Tabs
                value={state.value}
                onChange={(event, value) =>
                  dispatch({ type: "updateValue", payload: value })
                }
              >
                <Tab
                  icon={<WorkspacesIcon />}
                  iconPosition="start"
                  label="Spaces"
                  sx={{ pb: 1, pt: 3 }}
                />
                <Tab
                  icon={<SettingsIcon />}
                  iconPosition="start"
                  label="Settings"
                  sx={{ pb: 1, pt: 3 }}
                />
              </Tabs>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ minHeight: "70vh", backgroundColor: "background.paper" }}
        >
          <TabPanel value={state.value} index={0}>
            <UserSpaces
              setMessage={setMessage}
              setSuccess={setSuccess}
              setError={setError}
              loggedInUser={loggedInUser}
              listSpaces={state.listSpaces}
              dashboardDispatch={dispatch}
            />
          </TabPanel>
          <TabPanel value={state.value} index={1}>
            <UserSettings loggedInUser={loggedInUser} />
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
