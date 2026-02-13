import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
  Container,
  Stack,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axiosConfig from "../utils/axiosConfig";
import isEmail from "validator/lib/isEmail";
import useAuth from "../hooks/useAuth";
import { ColorModeContext } from "../context/ColorModeContext";
import { useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const REGISTER_URL = "/users/register";

function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState({ title: "", data: "" });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  useEffect(() => {
    if (isEmail(user.email) && user.name && user.password) {
      return setDisabled(false);
    }
    setDisabled(true);
  }, [user]);

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosConfig.post(REGISTER_URL, user);
      if (res.status === 201) {
        setAuth(res.data);
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        setMessage({ title: "Error!", data: err.response.data.error });
      } else {
        setMessage({ title: "Error!", data: "No server response" });
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = async (e) => {
    if (e.code === "Enter") {
      await register(e);
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
          <Stack spacing={2}>
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

            <TextField
              autoFocus
              error={user.email === "" ? false : !isEmail(user.email)}
              name="email"
              placeholder="skywalker@deathstar.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              onKeyUp={!disabled ? handleKey : null}
            />

            <TextField
              name="name"
              placeholder="Luke Skywalker"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              onKeyUp={!disabled ? handleKey : null}
            />

            <TextField
              type="password"
              name="password"
              placeholder="******"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              onKeyUp={!disabled ? handleKey : null}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Button onClick={() => navigate("/")} startIcon={<ArrowBackIcon />}>
                Back
              </Button>

              <Button
                loading={loading}
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={register}
                disabled={disabled}
              >
                Register
              </Button>
            </Stack>
          </Stack>
        </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Register;
