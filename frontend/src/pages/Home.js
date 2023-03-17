import React, { useState, useRef } from "react";
import { Box, Typography, Slide, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorSnackbar from "../components/ErrorSnackbar";
import { CustomTextField } from "../reuseable";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Footer from "../components/Footer";

function Home(props) {
  const spaceIdInput = useRef(null);
  const usernameInput = useRef(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!spaceIdInput.current?.value || !usernameInput.current?.value) {
      setError(false);
      return;
    }

    navigate(`/space/${spaceIdInput.current?.value}`, {
      state: {
        spaceId: spaceIdInput.current?.value,
        username: usernameInput.current?.value,
        email: null,
      },
    });
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleJoin();
    }
  };

  return (
    <>
      <ErrorSnackbar
        open={error}
        close={setError}
        title="All fields Required"
        message="One or more fields missing."
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
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: 25,
                fontWeight: 700,
                mb: 2,
                width: "90%",
                color: "text.primary",
              }}
            >
              Join a space.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CustomTextField
                autoFocus
                name="spaceId"
                placeholder="Paste Invite ID"
                sx={{ width: "100%", mb: 1 }}
                inputRef={spaceIdInput}
              />

              <CustomTextField
                name="name"
                placeholder="Enter name"
                sx={{ width: "100%", maxWidth: "100%", mb: 2 }}
                inputRef={usernameInput}
              />
            </Box>

            <Button
              variant="contained"
              sx={{ height: "45px", display: "block" }}
              onClick={handleJoin}
            >
              Join
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: 25,
                fontWeight: 700,
                mb: 2,
                color: "text.primary",
              }}
            >
              Create a space.
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Button
                variant="contained"
                sx={{ height: "45px", mr: 3 }}
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ height: "45px" }}
                startIcon={<PersonAddIcon />}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}

export default Home;
