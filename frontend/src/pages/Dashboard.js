import React, {useContext,useState} from 'react';
import {Box, Typography, Slide, TextField, Button, Snackbar, Alert, AlertTitle, Grid, Tabs, Tab} from "@mui/material";
import {UserContext} from "../UserContext";
import SettingsIcon from '@mui/icons-material/Settings';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";
import Spaces from "../components/Spaces"
import Settings from "../components/Settings"

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

function Dashboard(props) {

    const {currentUser,setCurrentUser} = useContext(UserContext);
    const current = JSON.parse(currentUser);
    const navigate = useNavigate()



    const handleLogout = () => {
        localStorage.clear();
        setCurrentUser(null);
        navigate("/", { replace: true });
    }

    const [value, setValue] = useState(0);

    return (
        <>
            <Typography variant="h1" sx={{color:"white",fontSize:50, fontWeight:700, position:"fixed",p:1}}>
                CodeCollab.
            </Typography>
            <Button variant="contained" sx={{position:"fixed", right:0, m:3}} startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
            </Button>
            <Grid container sx={{backgroundColor:"background.default",minHeight:"100vh"}}>
                <Grid item xs={12} sx={{height:"30vh"}}>
                    <Box sx={{height:"25vh",display:"flex", justifyContent:"center"}}>
                        <Box sx={{height:"inherit",minWidth:"50vw", display:"flex", justifyContent:"center",alignItems:"center"}}>

                            <Box
                                component="img"
                                src={`https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${current.name}?size=32`}
                                alt="avatar"
                                sx={{
                                    height:"150px",
                                   width:"150px",
                                    m:2,
                                    mr:5,
                                    borderRadius:2
                                }}
                            />
                            <Box>
                                <Typography variant="h1" sx={{color:"white",fontSize:50, fontWeight:700}}>
                                  {current.name}
                                </Typography>
                                <Typography variant="h1" sx={{color:"white",fontSize:30, fontWeight:400}}>
                                    {current.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{display:"flex", justifyContent:"center"}}>
                        <Tabs value={value} onChange={(event,value) => setValue(value)} sx={{height:"5vh"}}>
                            <Tab icon={<WorkspacesIcon />} iconPosition="start" label="Spaces" sx={{pb:3}}/>
                            <Tab  icon={<SettingsIcon />} iconPosition="start" label="Settings" sx={{pb:3}}/>
                        </Tabs>
                    </Box>

                </Grid>
                <Grid item xs={12} sx={{backgroundColor:"background.paper",minHeight:"70vh"}}>

                        <TabPanel value={value} index={0} >
                            <Spaces/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Settings/>
                        </TabPanel>

                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;