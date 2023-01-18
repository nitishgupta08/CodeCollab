import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Avatar, AvatarGroup, Tabs, Tab, IconButton, Backdrop, CircularProgress, Tooltip } from "@mui/material";
import Editor from "../components/Editor";
// import { initSocket } from "../scoket";
// import ACTIONS from "../Actions"
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import uniqid from 'uniqid';
import axios from 'axios'
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import { UserContext } from "../UserContext";
import uniqolor from 'uniqolor';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'background.secondary',
        color: 'text.primary',
        width: 220,
        fontSize: 15,
    },
}));

function CodeSpace() {
    const navigate = useNavigate();

    const [data, setData] = useState(null); //opened files
    const [openTabs, setOpenTabs] = useState(null); // All files
    const [value, setValue] = useState(0); //Tabs 
    const [active, setActive] = useState(null); //active users
    const [load, setLoad] = useState(false); //loading screen
    const [spaceName, setSpaceName] = useState(""); // Name of space to be shown
    const [changeData, setChangeData] = useState("");
    const [activeId, setActiveId] = useState(uniqid());
    const location = useLocation();
    const { currentUser } = useContext(UserContext);
    const loggedInUser = currentUser ? JSON.parse(currentUser) : null;


    useEffect(() => {
        setLoad(true);
        console.log(location.state.name);
        // axios.put(`http://localhost:8000/api/spaces/updateActive/${location.state.spaceId}`,
        //     {
        //         name: location.state.name,
        //         incoming: true,
        //         id: activeId
        //     })

        axios.get(`http://localhost:8000/api/spaces/${location.state.spaceId}`).then((res) => {
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


    // useEffect(() => {
    //     window.addEventListener('beforeunload', alertUser)
    //     window.addEventListener('unload', handleTabClosing)
    //     return () => {
    //         window.removeEventListener('beforeunload', alertUser)
    //         window.removeEventListener('unload', handleTabClosing)
    //     }
    // })

    // const handleTabClosing = () => {
    //     axios.put(`http://localhost:8000/api/spaces/updateActive/${location.state.spaceId}`,
    //         {
    //             name: location.state.name,
    //             incoming: false,
    //             id: activeId
    //         })
    // }

    // const alertUser = (event) => {
    //     event.preventDefault()
    //     event.returnValue = ''
    //     axios.put(`http://localhost:8000/api/spaces/updateActive/${location.state.spaceId}`,
    //         {
    //             name: location.state.name,
    //             incoming: false,
    //             id: activeId
    //         })
    // }



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

    // save data
    const handleSave = () => {
        const index = data.findIndex(x => openTabs[value].id === x.id);
        let newData = [...data];
        newData[index].fileData = changeData
        setData(newData);

        const user = JSON.parse(localStorage.getItem("user"))
        axios.put(`http://localhost:8000/api/spaces/${location.state.spaceId}`,

            {
                spaceData: data,
                activeUsers: active
            }
            , {
                headers: { Authorization: `Bearer ${user.token}` }
            })
    }

    return (
        <>
            <Backdrop
                sx={{ backgroundColor: 'background.default', zIndex: 2, display: "flex", flexDirection: "column" }}
                open={load}
            >
                <CircularProgress size={100} />
                <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 35, fontWeight: 700, mt: 5 }}>
                    Loading Space...
                </Typography>
            </Backdrop>
            <Grid container sx={{ backgroundColor: 'background.default' }}>
                <Grid item xs={12} sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 35, fontWeight: 700 }}>
                            CodeCollab.
                        </Typography>
                        <HtmlTooltip
                            title={
                                <React.Fragment>
                                    {active && active.map((client, id) => {
                                        return (<Typography key={id} color='text.primary'>{client.name}</Typography>)
                                    })}
                                </React.Fragment>
                            }
                        >
                            <AvatarGroup max={6}>
                                {active && active.map((client, id) => {
                                    return (<Avatar key={id} sx={{ bgcolor: uniqolor(client.name).color }}>{client.name[0]}</Avatar>)
                                })}
                            </AvatarGroup>
                        </HtmlTooltip>

                        {loggedInUser ? null : (
                            <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 15, fontWeight: 500 }}>
                                To edit this page please <Link to="/login">Login</Link>.
                            </Typography>
                        )}

                        <Button variant="contained" onClick={() => navigate("/")}>Leave Space</Button>
                        <Button variant="contained" onClick={handleSave}>Save</Button>

                    </Box>
                </Grid>

                <Grid item xs={1.5}>
                    <Box sx={{ p: 1 }}>
                        <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: 20, mb: 2 }}>
                            {spaceName}
                        </Typography>
                        <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: 12, mb: 2, opacity: 0.7 }}>
                            Files in this space:
                        </Typography>
                        {data && data.map((item, id) => {
                            return (
                                <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }} key={id}>
                                    <Typography sx={{ color: 'text.primary', fontSize: 15, cursor: "pointer" }} onClick={() => goToFile(item.id)}>
                                        {item.fileName}
                                    </Typography>
                                    {loggedInUser ? (<Box>
                                        <IconButton sx={{ color: "text.primary" }} onClick={editFile}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton sx={{ color: "text.primary" }} onClick={() => deleteFile(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>) : null}
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
                                return <Tab disableRipple label={
                                    <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                                        {item.fileName}
                                        <Box>
                                            <IconButton size="small" component="span" sx={{ color: "text.primary" }} onClick={() => closeOpenTab(item.id)}>
                                                <CloseIcon sx={{ fontSize: "20px" }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                }
                                    key={id} />
                            })}
                        </Tabs>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {loggedInUser ? (<IconButton sx={{ color: "text.primary" }} onClick={newFile}>
                                <AddIcon />
                            </IconButton>) : null}
                            <IconButton sx={{ color: "text.primary" }} >
                                <SettingsIcon />
                            </IconButton>
                        </Box>

                    </Grid>

                    <Editor data={openTabs && openTabs[value]} loggedInUser={loggedInUser} setChangeData={setChangeData} />
                </Grid>
            </Grid>
        </>
    );
}

export default CodeSpace;