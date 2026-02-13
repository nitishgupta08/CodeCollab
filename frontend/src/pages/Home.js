import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Container,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../context/ColorModeContext";

function Home() {
  const [spaceId, setSpaceId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState({ title: "", data: "" });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  useEffect(() => {
    document.title = "CodeCollab";
  }, []);

  useEffect(() => {
    if (name && spaceId) {
      return setDisabled(false);
    }
    setDisabled(true);
  }, [name, spaceId]);

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    navigate(`/space/${spaceId}`, {
      state: {
        spaceId,
        name,
        email: null,
      },
    });
    setLoading(false);
  };

  const handleKey = async (e) => {
    if (e.code === "Enter") {
      await handleJoin(e);
    }
  };

  return (
    <>
      <Snackbar
        open={error}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
          <AlertTitle>{message.title}</AlertTitle>
          {message.data}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              backgroundColor: "background.paper",
              p: { xs: 2.5, sm: 3 },
              boxShadow: "0px 0px 5px 5px #42a5f5",
            }}
          >
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: 40, sm: 50 },
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  CodeCollab.
                </Typography>

                <IconButton onClick={colorMode.toggleColorMode}>
                  {theme.palette.mode === "light" ? (
                    <DarkModeIcon sx={{ fontSize: 40 }} />
                  ) : (
                    <LightModeIcon sx={{ fontSize: 40 }} />
                  )}
                </IconButton>
              </Box>

              <Stack spacing={2}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: 25,
                    fontWeight: 700,
                    width: "90%",
                    color: "text.primary",
                  }}
                >
                  Join a space.
                </Typography>

                <Stack spacing={1.5}>
                  <TextField
                    autoFocus
                    name="spaceId"
                    value={spaceId}
                    placeholder="Paste Invite ID"
                    onChange={(e) => setSpaceId(e.target.value)}
                    onKeyUp={!disabled ? handleKey : null}
                  />

                  <TextField
                    name="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyUp={!disabled ? handleKey : null}
                  />
                </Stack>

                <Button
                  loading={loading}
                  variant="contained"
                  onClick={handleJoin}
                  sx={{ width: "fit-content" }}
                  disabled={disabled}
                >
                  Join
                </Button>
              </Stack>

              <Divider variant="middle" />

              <Stack spacing={2}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: 25,
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  Create a space.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Home;
