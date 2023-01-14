import React, { useContext, useState } from 'react';
import { Box, Typography, Slide, TextField, Button, Snackbar, Alert, AlertTitle, Grid, Backdrop } from "@mui/material";
import { UserContext } from "../UserContext";
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from "axios"
import YourSpaces from './YourSpaces';


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

function Spaces({ setMessage, setOpen, setEopen }) {

    const [spaceId, setSpaceId] = useState("");
    const [spaceName, setSpaceName] = useState("");
    const [bdo, setBdo] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext)
    const user = JSON.parse(currentUser)

    const handleNew = () => {
        const id = uuidv4();
        setSpaceId(id);
        setBdo(true);
    }

    const handleCreate = () => {
        if (!spaceName) {
            setEopen(true);
            setMessage({ title: ":(", data: "Name cannot be empty" })
            return;
        }

        axios.post("http://localhost:8000/api/spaces", { spaceId, spaceName }, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then((res) => {
            if (res.status === 200) {

                console.log(res)
                setBdo(false);
                // navigate(`/codespace/${spaceId}`, {
                //     state: {
                //         spaceId,
                //         name: user.name,
                //     }
                // });
            }
        })
    }

    const copySpaceId = () => {
        navigator.clipboard.writeText(spaceId);
        setOpen(true);
        setMessage({ title: "Copied!", data: "Spaceid copied to clipboard." })
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: 2, backdropFilter: "blur(4px)" }}
                open={bdo}
            >
                <Slide direction="up" in={bdo} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            width: "25vw",
                            backgroundColor: "background.alter",
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "column",
                            p: 3,
                        }}>
                        <Typography variant="h2" sx={{ color: "black", fontSize: 30, fontWeight: 700, mb: 4 }}>
                            Give your space a name.
                        </Typography>
                        <CustomTextField
                            disabled
                            name="spaceid"
                            placeholder="Paste Invite ID"
                            sx={{ width: "500px", maxWidth: "100%", mb: 1 }}
                            value={spaceId}
                            onChange={(e) => setSpaceId(e.target.value)}
                        />

                        <CustomTextField
                            autoFocus
                            name="name"
                            placeholder="Enter name"
                            sx={{ width: "500px", maxWidth: "100%", mb: 2 }}
                            value={spaceName}
                            onChange={(e) => setSpaceName(e.target.value)}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex" }}>
                                <Button variant="contained" sx={{ height: "43px", mr: 2 }} onClick={handleCreate}>Create</Button>
                                <Button variant="contained" sx={{ height: "43px" }} onClick={() => setBdo(false)}>Cancel</Button>
                            </Box>

                            <Button variant="contained" sx={{ height: "43px" }} onClick={copySpaceId} startIcon={<ContentCopyIcon />}>Space Id</Button>
                        </Box>
                    </Box>
                </Slide>
            </Backdrop>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ minWidth: "50vw", minHeight: "70vh", mb: 10 }}>
                    <Box sx={{ p: 2, pt: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontSize: 40, fontWeight: 700, color: "white" }}>
                            Your spaces.
                        </Typography>

                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>
                            Create a new space
                        </Button>
                    </Box>



                    <YourSpaces setMessage={setMessage} setOpen={setOpen} setEopen={setEopen} />

                </Box>
            </Box>

        </>

    );
}

export default Spaces;