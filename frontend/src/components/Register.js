import React, { useContext, useState } from 'react';
import { Box, IconButton, TextField, Button, Alert, AlertTitle, Snackbar, Slide } from "@mui/material";
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";


function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}


const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
            color: "black"
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },

    '& .MuiInputBase-input': {
        borderRadius: 2,
        backgroundColor: '#fcfcfb',
        fontSize: 16,
        padding: '10px 12px',
        color: "black",
        '&:hover': {
            border: "none"
        },
    }
});
function Register({ setRegister }) {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const emailRegex = /\S+@\S+\.\S+/;
    const { setCurrentUser } = useContext(UserContext);


    const register = () => {
        if (user.name && user.email && user.password) {
            if (emailRegex.test(user.email)) {
                axios.post("http://localhost:8000/api/users/register", user)
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
            } else {
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
            <Box>
                <IconButton sx={{ mb: 2 }} onClick={() => setRegister(false)}>
                    <ArrowBackIcon fontSize="large" sx={{ color: "white" }} />
                </IconButton>
                <CustomTextField
                    autoFocus
                    name="name"
                    placeholder="Enter Name"
                    sx={{ width: "500px", maxWidth: "100%", mb: 3 }}
                    value={user.name}

                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <CustomTextField
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

                <Button variant="contained" sx={{ height: "50px" }} onClick={register}>Register</Button>
            </Box>
        </>
    );
}

export default Register;