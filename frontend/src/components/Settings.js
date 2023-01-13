import React, {useContext, useState} from 'react';
import {Box, Typography, Slide, TextField, Button, Snackbar, Alert, AlertTitle} from "@mui/material";
import {styled} from "@mui/material/styles";
import {UserContext} from "../UserContext";

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
            color:"black"
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },

    '& .MuiInputBase-input': {
        borderRadius:2,
        backgroundColor: '#fcfcfb',
        fontSize: 16,
        padding: '10px 12px',
        color:"black",
        '&:hover': {
            border:"none"
        },
    }
});



function Settings(props) {
    const {currentUser} = useContext(UserContext)
    const user = JSON.parse(currentUser)
    const [editName,setEditName] = useState(false);
    const [editPass,setEditPass] = useState(false);
    const [newPass,setNewPass] = useState("");

    const handeChangeName = () => {
        setEditName(false);
    }

    const handleChangePass = () => {
        setEditPass(false);
    }
    return (
        <Box sx={{display:"flex",flexDirection:"column",mt:5,ml:30}}>
            <Box sx={{mb:5}}>
                <Typography variant="h2" sx={{color:"black",fontSize:20, fontWeight:700,mb:1}}>
                    email.
                </Typography>
                <CustomTextField
                    disabled
                    name="email"
                    value={user.email}
                    sx={{width:"400px"}}
                />
            </Box>

            <Box sx={{mb:5}}>
                <Typography variant="h2" sx={{color:"black",fontSize:20, fontWeight:700,mb:1}}>
                    name.
                </Typography>
                <Box sx={{display:"flex"}}>
                    <CustomTextField
                        disabled={editName ? false:true}
                        name="name"
                        value={user.name}
                        sx={{width:"400px",mr:2}}
                    />
                    {!editName ? (
                        <Button variant="contained" sx={{height:"43px"}} onClick={handeChangeName}>Edit</Button>
                    ): (
                        <Button variant="contained" sx={{height:"43px"}} onClick={() => setEditName(false)}>Submit</Button>
                    )}
                </Box>
            </Box>

            <Box >
                <Typography variant="h2" sx={{color:"black",fontSize:20, fontWeight:700,mb:1}}>
                    change password.
                </Typography>
                {editPass ? (
                    <>
                        <Box sx={{display:"flex"}}>
                            <CustomTextField
                                type="password"
                                name="password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                placeholder="Enter new password"
                                sx={{width:"400px",mr:2}}
                            />

                            <Button variant="contained" sx={{height:"43px",mr:2}} onClick={handleChangePass}>Submit</Button>

                            <Button variant="contained" sx={{height:"43px"}} onClick={() => setEditPass(false)}>Cancel</Button>

                        </Box>
                    </>
                ):(
                    <Button variant="contained" sx={{height:"43px"}} onClick={() => setEditPass(true)}>Change password</Button>
                )}


            </Box>
        </Box>
    );
}

export default Settings;