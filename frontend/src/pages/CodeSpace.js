import React, { useState } from 'react';
import { Box, Button, Grid, Typography, Avatar, AvatarGroup, Tabs, Tab, IconButton } from "@mui/material";
import Editor from "../components/Editor";
// import { initSocket } from "../scoket";
// import ACTIONS from "../Actions"
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import uniqid from 'uniqid';

function CodeSpace() {
    const navigate = useNavigate();

    const [clients, setClients] = useState([{ id: 1, name: "Nitish K" }, { id: 2, name: "Ram A" }, { id: 3, name: "Tam A" }, { id: 4, name: "Bam A" }, { id: 5, name: "Sam A" }, { id: 6, name: "Jam A" }]);


    const [data, setData] = useState([{ id: uniqid(), fileName: "Untitled-1", lang: "js", fileData: `console.log('Hello Nitish')` }]); //opened files
    const [openTabs, setOpenTabs] = useState(data); // All files
    const [value, setValue] = useState(0); //Tabs 


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
            <Grid container sx={{ backgroundColor: "background.default" }} >

                <Grid item xs={12} sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h1" sx={{ fontSize: 35, fontWeight: 700 }}>
                            CodeCollab.
                        </Typography>


                        <AvatarGroup max={4}>
                            {clients.map((client) => {
                                return (<Avatar key={client.id} alt={client.name} />)
                            })}
                        </AvatarGroup>
                        <Button variant="contained" onClick={() => navigate("/")}>Leave Space</Button>

                    </Box>
                </Grid>

                <Grid item xs={1.5} sx={{ backgroundColor: "background.default" }}>
                    <Box sx={{ p: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>
                            Space Name
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
                            TabIndicatorProps={{
                                style: {
                                    backgroundColor: "red"
                                }
                            }}
                        >
                            {openTabs.map((item, id) => {
                                return <Tab label={
                                    < Box component="span" >
                                        {item.fileName}
                                        <IconButton size="small" sx={{}} component="span" onClick={() => closeOpenTab(item.id)}>
                                            <CloseIcon sx={{ fontSize: "20px" }} />
                                        </IconButton>
                                    </Box>
                                }
                                    key={id} />
                            })}
                        </Tabs>
                        <IconButton onClick={newFile}>
                            <AddIcon />
                        </IconButton>
                        <IconButton >
                            <SettingsIcon />
                        </IconButton>
                    </Grid>

                    <Editor data={openTabs[value]} />
                </Grid>
            </Grid>
        </>
    );
}

export default CodeSpace;