import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Slide, Button, Snackbar, Alert, AlertTitle, Grid, Tabs, Tab } from "@mui/material";
import { UserContext } from "../UserContext";
import SettingsIcon from '@mui/icons-material/Settings';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import Spaces from "../components/Spaces"
import Settings from "../components/Settings"


function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}


const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function Dashboard() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const current = JSON.parse(currentUser);
    const navigate = useNavigate()
    const [value, setValue] = useState(0);
    const [top, setTop] = useState(false);
    const [open, setOpen] = useState(false);
    const [eopen, setEopen] = useState(false);
    const [message, setMessage] = useState({ title: "", data: "" });

    const handleLogout = () => {
        localStorage.clear();
        setCurrentUser(null);
        navigate("/", { replace: true });
    }

    useEffect(() => {
        const scrollHandler = () => {
            window.pageYOffset > 5 ? setTop(false) : setTop(true)
        };
        window.addEventListener('scroll', scrollHandler);
        scrollHandler();

        return () => {
            window.removeEventListener('scroll', scrollHandler);
        }
    }, []);


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
                    <AlertTitle>{message.title}</AlertTitle>
                    {message.data}
                </Alert>
            </Snackbar>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={SlideTransition}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={2500}
            >
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    <AlertTitle>{message.title}</AlertTitle>
                    {message.data}
                </Alert>

            </Snackbar>
            <Box sx={{
                position: "fixed",
                width: "100vw",
                display: "flex",
                zIndex: 1,
                justifyContent: 'space-between',
                backdropFilter: !top && "blur(50px)",
                color: !top && "transparent"
            }}>
                <Typography variant="h1" sx={{ color: "white", fontSize: 50, fontWeight: 700, p: 1 }}>
                    CodeCollab.
                </Typography>
                <Button variant="contained" sx={{ m: 3 }} startIcon={<LogoutIcon />} onClick={handleLogout}>
                    Logout
                </Button>

            </Box >
            <Grid container sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
                <Grid item xs={12} sx={{ height: "30vh" }}>
                    <Box sx={{ height: "20vh", display: "flex", justifyContent: "center", pt: 2 }}>
                        <Box sx={{ height: "inherit", minWidth: "50vw", display: "flex", justifyContent: "center", alignItems: "center" }}>

                            <Box
                                component="img"
                                src={`https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${current.name}?size=32`}
                                alt="avatar"
                                sx={{
                                    height: "150px",
                                    width: "150px",
                                    mr: 5,
                                    borderRadius: 2
                                }}
                            />
                            <Box>
                                <Typography variant="h1" sx={{ color: "white", fontSize: 50, fontWeight: 700 }}>
                                    {current.name}
                                </Typography>
                                <Typography variant="h1" sx={{ color: "white", fontSize: 30, fontWeight: 400 }}>
                                    {current.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", position: "relative", bottom: "6px" }}>
                        <Tabs value={value} onChange={(event, value) => setValue(value)}>
                            <Tab icon={<WorkspacesIcon />} iconPosition="start" label="Spaces" sx={{ pb: 1, pt: 3 }} />
                            <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" sx={{ pb: 1, pt: 3 }} />
                        </Tabs>
                    </Box>

                </Grid>
                <Grid item xs={12} sx={{ backgroundColor: "background.paper", minHeight: "70vh" }}>

                    <TabPanel value={value} index={0} >
                        <Spaces setMessage={setMessage} setOpen={setOpen} setEopen={setEopen} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Settings />
                    </TabPanel>

                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;