import React, { useState, useContext, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { CustomTextField } from "../reuseable";
import ErrorSnackbar from "../components/ErrorSnackbar";
import LoginIcon from "@mui/icons-material/Login";
import useLocalStorage from "../hooks/useLocalStorage";
import Footer from "../components/Footer";
import axiosConfig from "../utils/axiosConfig";
// import LoadingButton from "@mui/lab/LoadingButton";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [localUser, setLocalUser] = useLocalStorage("user", null);

  const emailRegex = /\S+@\S+\.\S+/;

  const login = () => {
    if (user.email && user.password) {
      if (emailRegex.test(user.email)) {
        axiosConfig
          .post("/users/login", user)
          .then((res) => {
            if (res.status === 200) {
              setLoggedInUser(JSON.stringify(res.data));
              setLocalUser(res.data);
              navigate("/dashboard", {
                replace: true,
                state: {
                  loggedInUser: res.data,
                },
              });
            }
          })
          .catch((err) => {
            setMessage(err.response.data.message);
            setError(true);
          });
      } else {
        setMessage("Invalid email format");
        setError(true);
      }
    } else {
      setMessage("One or more fields missing.");
      setError(true);
    }
  };

  return (
    <>
      <ErrorSnackbar
        open={error}
        close={setError}
        message={message}
        title="Error"
      />

      <Box
        sx={{
          backgroundColor: "background.default",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            minWidth: "40vw",
            backgroundColor: "background.paper",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
            boxShadow: "0px 0px 5px 5px #00E5B5",
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: 50, fontWeight: 700, mb: 3, color: "text.primary" }}
          >
            CodeCollab.
          </Typography>

          <CustomTextField
            autoFocus
            name="email"
            placeholder="Enter email"
            sx={{ width: "100%", mb: 1 }}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <CustomTextField
            type="password"
            name="password"
            placeholder="Enter password"
            sx={{ width: "100%" }}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ height: "45px", mt: 2 }}
              onClick={() => navigate("/")}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>

            {/*<LoadingButton*/}
            {/*  variant="contained"*/}
            {/*  sx={{ height: "45px", mt: 2 }}*/}
            {/*  onClick={login}*/}
            {/*  startIcon={<LoginIcon />}*/}
            {/*>*/}
            {/*  Login*/}
            {/*</LoadingButton>*/}

            <Button
              variant="contained"
              sx={{ height: "45px", mt: 2 }}
              onClick={login}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Login;
