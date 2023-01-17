import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Avatar, AvatarGroup, Tabs, Tab, IconButton, Backdrop, CircularProgress } from "@mui/material";
import Editor from "../components/Editor";
// import { initSocket } from "../scoket";
// import ACTIONS from "../Actions"
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import uniqid from 'uniqid';
import axios from 'axios'
import { UserContext } from "../UserContext";


function CodeSpace() {
    const navigate = useNavigate();

    const [data, setData] = useState(null); //opened files
    const [openTabs, setOpenTabs] = useState(null); // All files
    const [value, setValue] = useState(0); //Tabs 
    const [active, setActive] = useState(null); //active users
    const [load, setLoad] = useState(false); //loading screen
    const [spaceName, setSpaceName] = useState("");
    const { currentUser } = useContext(UserContext)
    const user = JSON.parse(currentUser)
    const location = useLocation();


    useEffect(() => {
        setLoad(true);

        axios.get(`http://localhost:8000/api/spaces/${location.state.id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }).then((res) => {
            if (res.status === 200) {
                setData(res.data.spaceData);
                setActive(res.data.activeUsers);
                setOpenTabs([res.data.spaceData[0]]);
                setSpaceName(res.data.spaceName);
                setLoad(false);
                console.log(res);
            }
        })
    }, [])


    //change tab
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // create a new file
    const newFile = () => {
        let fileobj = {
            id: uniqid(),
            fileName: `Untitled-${data.length + 1}`,
            lang: 'js',
            fileData: `console.log('Hello Nitish-${data.length + 1}')`
        };

        setOpenTabs([...openTabs, fileobj])
        setData([...data, fileobj])
        setValue(openTabs.length);
    }

    const editFile = () => {

    }

    // delete file
    const deleteFile = (id) => {
        if (openTabs.find((item) => item.id === id)) {
            const i = openTabs.findIndex((item) => item.id === id);
            setValue(i === 0 ? i : i - 1);
            setOpenTabs(openTabs.filter((i) => i.id !== id));
        }

        setData(data.filter((i) => i.id !== id));

    }

    // open file in a tab
    const goToFile = (id) => {
        let i = data.findIndex(x => x.id === id);
        if (openTabs.find((item) => item.id === id)) {
            setValue(openTabs.findIndex(x => x.id === id));
        } else {
            setOpenTabs([...openTabs, data[i]]);
            setValue(openTabs.length);
        }

    }


    const closeOpenTab = (id) => {
        const i = openTabs.findIndex(x => x.id === id);
        setValue(i === 0 ? i : i - 1)
        setOpenTabs(openTabs.filter((item) => item.id !== id));
    }

    return (
        <>
            <Backdrop
                sx={{ backgroundColor: 'white', zIndex: 2, display: "flex", flexDirection: "column" }}
                open={load}
            >
                <CircularProgress size={100} />
                <Typography variant="h1" sx={{ fontSize: 35, fontWeight: 700, mt: 5 }}>
                    Loading Space.
                </Typography>
            </Backdrop>
            <Grid container>
                <Grid item xs={12} sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h1" sx={{ fontSize: 35, fontWeight: 700 }}>
                            CodeCollab.
                        </Typography>


                        <AvatarGroup max={4}>
                            {active && active.map((client, id) => {
                                return (<Avatar key={id}>{client[0]}</Avatar>)
                            })}
                        </AvatarGroup>
                        <Button variant="contained" onClick={() => navigate("/")}>Leave Space</Button>

                    </Box>
                </Grid>

                <Grid item xs={1.5}>
                    <Box sx={{ p: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>
                            {spaceName}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 2, opacity: 0.7 }}>
                            Files in this space:
                        </Typography>
                        {data && data.map((item, id) => {
                            return (
                                <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }} key={id}>
                                    <Typography sx={{ fontSize: 15, cursor: "pointer" }} onClick={() => goToFile(item.id)}>
                                        {item.fileName}
                                    </Typography>
                                    <Box>
                                        <IconButton sx={{ color: "inherit" }} onClick={editFile}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton sx={{ color: "inherit" }} onClick={() => deleteFile(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </Grid>
                <Grid item xs={10.5}>
                    <Grid item xs={12} sx={{ display: "flex" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {openTabs && openTabs.map((item, id) => {
                                return <Tab label={
                                    < Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                                        {item.fileName}
                                        <Box>
                                            <IconButton size="small" component="span" onClick={() => closeOpenTab(item.id)}>
                                                <CloseIcon sx={{ fontSize: "20px" }} />
                                            </IconButton>
                                        </Box>

                                    </Box>
                                }
                                    key={id} />
                            })}
                        </Tabs>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton onClick={newFile}>
                                <AddIcon />
                            </IconButton>
                            <IconButton >
                                <SettingsIcon />
                            </IconButton>
                        </Box>

                    </Grid>

                    <Editor data={openTabs && openTabs[value]} />
                </Grid>
            </Grid>
        </>
    );
}

export default CodeSpace;