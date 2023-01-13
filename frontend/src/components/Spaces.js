import React, {useContext, useState} from 'react';
import {Box, Typography, Slide, TextField, Button, Snackbar, Alert, AlertTitle, Grid, Backdrop} from "@mui/material";
import {UserContext} from "../UserContext";
import AddIcon from '@mui/icons-material/Add';
import {v4 as uuidv4} from "uuid";
import {styled} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


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

function Spaces(props) {

    const [spaceId,setSpaceId] = useState("");
    const [spaceName,setSpaceName] = useState("");
    const [open, setOpen] = useState(false);
    const [eopen,setEopen] = useState(false);
    const [copy,setCopy] = useState(false);
    const navigate = useNavigate();
    const {currentUser} = useContext(UserContext)
    const user = JSON.parse(currentUser)

    const handleNew = () => {
        const id = uuidv4();
        setSpaceId(id);
        setOpen(true);
    }

    const handleCreate = () => {
        if(!spaceName) {
            setEopen(true);
            return;
        }

        setOpen(false);
        navigate(`/codespace/${spaceId}`,{
            state:{
                spaceId,
                name: user.name,
            }
        });

    }

    const copySpaceId = () => {
        setCopy(true);
        navigator.clipboard.writeText(spaceId);

    }

    return (
        <>
            <Snackbar
                open={eopen}
                onClose={() => setEopen(false)}
                TransitionComponent={SlideTransition}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3500}
            >

                <Alert onClose={() => setEopen(false)} severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>:(</AlertTitle>
                    Name cannot be empty.
                </Alert>
            </Snackbar>
            <Snackbar
                open={copy}
                onClose={() => setCopy(false)}
                TransitionComponent={SlideTransition}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3500}
            >

                <Alert onClose={() => setCopy(false)} severity="success" sx={{ width: '100%' }}>
                    <AlertTitle>Copied!</AlertTitle>
                    SpaceID copied to clipboard.
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: 2 , backdropFilter: "blur(4px)"}}
                open={open}
            >
                <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                    <Box
                        sx={{height:"25vh",
                            width:"25vw",
                            backgroundColor:"background.alter",
                            borderRadius:2,
                            display:"flex",
                            flexDirection:"column",
                            p:2,
                        }}>
                        <Typography variant="h2" sx={{color:"black",fontSize:30, fontWeight:700,mb:4}}>
                            Give your space a name.
                        </Typography>
                        <CustomTextField
                            disabled
                            name="spaceid"
                            placeholder="Paste Invite ID"
                            sx={{width:"500px", maxWidth:"100%",mb:1}}
                            value={spaceId}
                            onChange = {(e) => setSpaceId(e.target.value)}
                        />

                        <CustomTextField
                            autoFocus
                            name="name"
                            placeholder="Enter name"
                            sx={{width:"500px", maxWidth:"100%",mb:2}}
                            value={spaceName}
                            onChange = {(e) => setSpaceName(e.target.value)}
                        />

                        <Box sx={{display:"flex", justifyContent: "space-between"}}>
                            <Box sx={{display:"flex"}}>
                                <Button variant="contained" sx={{height:"43px",mr:2}} onClick={handleCreate}>Create</Button>
                                <Button variant="contained" sx={{height:"43px"}} onClick={() => setOpen(false)}>Cancel</Button>
                            </Box>

                            <Button variant="contained" sx={{height:"43px"}} onClick={copySpaceId} startIcon={<ContentCopyIcon />}>Space Id</Button>
                        </Box>




                    </Box>
                </Slide>
            </Backdrop>
            <Grid container>
                <Grid item xs={10}>
                    List all spaces
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew} sx={{mt:10}}>
                        Create a new space
                    </Button>
                </Grid>
            </Grid>
        </>

    );
}

export default Spaces;