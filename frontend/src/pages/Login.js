import React, { useState, useContext } from 'react';
import { Box, IconButton, Button, Snackbar, Alert, AlertTitle, Slide, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { CustomTextField } from '../reuseable';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

function Login() {
    const [user, setUser] = useState({ email: "", password: "" })
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(UserContext);
    const emailRegex = /\S+@\S+\.\S+/;

    const login = () => {
        if (user.email && user.password) {
            if (emailRegex.test(user.email)) {
                axios.post("http://localhost:8000/api/users/login", user)
                    .then((res) => {
                        if (res.status === 201 || res.status === 200) {
                            setCurrentUser(JSON.stringify(res.data));
                            navigate("/dashboard", {
                                replace: true
                            });

                        }
                    }).catch((err) => {
                        setMessage(err.response.data.message)
                        setOpen(true)
                    });
            }
            else {
                setMessage("Invalid email format");
                setOpen(true);
            }

        } else {
            setMessage("One or more fields missing.");
            setOpen(true);
        }

    }

    return (
        <>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={SlideTransition}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3500}
            >

                <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>Error</AlertTitle>
                    {message}
                </Alert>
            </Snackbar>
            <Box sx={{
                backgroundColor: "background.default",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Box
                    sx={{
                        width: "25vw",
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 3,
                        boxShadow: "0px 0px 5px 5px #00E5B5"
                    }}>
                    <Typography variant="h1" sx={{ fontSize: 50, fontWeight: 700, mb: 3, color: "text.primary" }}>
                        CodeCollab.
                    </Typography>
                    <Box>
                        <IconButton sx={{ mb: 4, color: "text.primary" }} onClick={() => navigate('/')}>
                            <ArrowBackIcon fontSize="large" />
                        </IconButton>
                    </Box>

                    <CustomTextField
                        autoFocus
                        name="email"
                        placeholder="Enter email"
                        sx={{ width: "500px", maxWidth: "100%", mb: 3 }}
                        value={user.email}

                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <CustomTextField
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        sx={{ width: "500px", maxWidth: "100%", mb: 5 }}
                        value={user.password}

                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    <Box>
                        <Button variant="contained" sx={{ height: "50px" }} onClick={login}>Login</Button>
                    </Box>
                </Box>
            </Box>
        </>

    );
}

export default Login;