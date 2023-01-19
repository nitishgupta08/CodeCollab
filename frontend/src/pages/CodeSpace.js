import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Avatar, AvatarGroup, Tabs, Tab, IconButton, Backdrop, CircularProgress, Tooltip, FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import Editor from "../components/Editor";
// import { initSocket } from "../scoket";
// import ACTIONS from "../Actions"
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import uniqid from 'uniqid';
import axios from 'axios'
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import { UserContext } from "../UserContext";
import uniqolor from 'uniqolor';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { editorTheme } from '../editorThemes';
import { editorLang } from '../editorLang';
import InputBase from '@mui/material/InputBase';

const CustomInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.secondary,
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: theme.palette.primary.main,
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

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

    const [data, setData] = useState(null); // All files
    const [openTabs, setOpenTabs] = useState(null);  //opened files
    const [value, setValue] = useState(0); //Tabs 
    const [active, setActive] = useState(null); //active users
    const [load, setLoad] = useState(false); //loading screen
    const [spaceName, setSpaceName] = useState(""); // Name of space to be shown
    const [changeData, setChangeData] = useState("");
    const [activeId, setActiveId] = useState(uniqid());
    const location = useLocation();
    const { currentUser } = useContext(UserContext);
    const loggedInUser = currentUser ? JSON.parse(currentUser) : null;
    const [etheme, setEtheme] = useState(editorTheme[0].value);
    const [langIndex, setLangIndex] = useState(0);

    useEffect(() => {
        setLoad(true);
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
            lang: langIndex,
            fileData: `Write your code here`
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
            setValue(openTabs.findIndex(x => x.id === id)); //Error on LandIndex
        } else {
            setOpenTabs([...openTabs, data[i]]);
            setValue(openTabs.length);
            setLangIndex(data[i].lang)
        }

    }

    const closeOpenTab = (id) => {
        const i = openTabs.findIndex(x => x.id === id);
        setValue(i === 0 ? i : i - 1)
        setOpenTabs(openTabs.filter((item) => item.id !== id));
        setLangIndex(openTabs[i].lang)
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

    useEffect((e) => {
        console.log(langIndex)
        if (data) {
            const index = data.findIndex(x => openTabs[value].id === x.id);
            let newData = [...data];
            newData[index].lang = langIndex
            setData(newData);
        }

    }, [langIndex])


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
                        <Box sx={{ display: 'flex', alignItems: "flex-end" }}>
                            <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 35, fontWeight: 700, mr: 5 }}>
                                CodeCollab.
                            </Typography>
                            <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 12, fontWeight: 700, opacity: 0.8 }}>
                                Autosave in progress.<CircularProgress size={18} sx={{ ml: 1 }} />
                            </Typography>
                            <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 12, fontWeight: 700, opacity: 0.8 }}>
                                Autosave complete. <CheckCircleIcon fontSize="small" sx={{ ml: 1, color: "primary.main" }} />
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex' }}>
                            <HtmlTooltip
                                title={
                                    <React.Fragment>
                                        {active && active.map((client, id) => {
                                            return (<Typography key={id} color='text.primary'>{client.name}</Typography>)
                                        })}
                                    </React.Fragment>
                                }
                            >
                                <AvatarGroup max={6} sx={{ mr: 5 }}>
                                    {active && active.map((client, id) => {
                                        return (<Avatar key={id} sx={{ bgcolor: uniqolor(client.name).color }}>{client.name[0]}</Avatar>)
                                    })}
                                </AvatarGroup>
                            </HtmlTooltip>

                            {loggedInUser ?
                                <IconButton onClick={handleSave} sx={{ color: 'text.primary' }}>
                                    <SaveIcon />
                                </IconButton> :

                                <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 15, fontWeight: 500 }}>
                                    To edit this page please <Link to="/login">Login</Link>.
                                </Typography>
                            }

                            <Button variant="contained" sx={{ ml: 1 }} onClick={() => { loggedInUser ? navigate("/dashboard") : navigate("/") }}>Leave Space</Button>
                        </Box>
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
                    <Grid item xs={12} sx={{ display: 'flex' }}>
                        <Grid item xs={10} sx={{ display: 'flex' }}>
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
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                                {loggedInUser ? (<IconButton sx={{ color: "text.primary" }} onClick={newFile}>
                                    <AddIcon />
                                </IconButton>) : null}
                            </Box>

                        </Grid>
                        <Grid item xs={2}>
                            <FormControl sx={{ minWidth: 80, mt: 1, mb: 1, mr: 3 }} size="small">
                                <InputLabel>Theme</InputLabel>
                                <Select
                                    value={etheme}
                                    onChange={(e) => setEtheme(e.target.value)}
                                    autoWidth
                                    label="Theme"
                                    input={<CustomInput />}

                                >
                                    {editorTheme.map((theme, id) => {
                                        return <MenuItem value={theme.value} key={id}>{theme.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 80, mt: 1, mb: 1 }} size="small">
                                <InputLabel>Language</InputLabel>
                                <Select
                                    value={langIndex}
                                    onChange={(e) => setLangIndex(e.target.value)}
                                    autoWidth
                                    label="Language"
                                    input={<CustomInput />}

                                >
                                    {editorLang.map((lang, id) => {
                                        return <MenuItem value={lang.index} key={id}>{lang.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>


                    <Grid item xs={12}>
                        <Editor data={openTabs && openTabs[value]} loggedInUser={loggedInUser} setChangeData={setChangeData} etheme={etheme} langIndex={langIndex} />
                    </Grid>

                </Grid>
            </Grid>
        </>
    );
}

export default CodeSpace;