import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Footer from "../components/Footer";
import ErrorSnackbar from "../components/ErrorSnackbar";
import axiosConfig from "../utils/axiosConfig";
import isEmail from "validator/lib/isEmail";
import useAuth from "../hooks/useAuth";

const REGISTER_URL = "/users/register";

function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState({ title: "", data: "" });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

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
        console.log(res.data);
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
      <ErrorSnackbar
        open={error}
        close={setError}
        data={message.data}
        title={message.title}
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
            minWidth: "30vw",
            backgroundColor: "grey.900",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            p: 3,
            boxShadow: "0px 0px 5px 5px #42a5f5",
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: 50, fontWeight: 700, mb: 3, color: "text.primary" }}
          >
            CodeCollab.
          </Typography>

          <TextField
            autoFocus
            error={user.email === "" ? false : !isEmail(user.email)}
            name="email"
            placeholder="skywalker@deathstar.com"
            sx={{ width: "100%", mb: 1 }}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            onKeyUp={!disabled ? handleKey : null}
          />

          <TextField
            name="name"
            placeholder="Luke Skywalker"
            sx={{ width: "100%", mb: 1 }}
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            onKeyUp={!disabled ? handleKey : null}
          />

          <TextField
            type="password"
            name="password"
            placeholder="******"
            sx={{ width: "100%" }}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            onKeyUp={!disabled ? handleKey : null}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ height: "45px", mt: 2 }}
              onClick={() => navigate("/")}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>

            <LoadingButton
              loading={loading}
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={register}
              sx={{
                height: "45px",
                mt: 2,
              }}
              disabled={disabled}
            >
              Register
            </LoadingButton>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Register;
