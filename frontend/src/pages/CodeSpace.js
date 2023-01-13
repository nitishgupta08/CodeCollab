import React, {useState, useRef, useEffect} from 'react';
import {Box, Button, Grid, Typography, Avatar, AvatarGroup} from "@mui/material";
import Editor from "../components/Editor";
import {initSocket} from "../scoket";
import ACTIONS from "../Actions"
import {useLocation, useNavigate} from "react-router-dom";

function CodeSpace(props) {

    const socketRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            const handleErrors = (e) => {
                console.log('socket error',e);
                //toast
                navigate("/")

            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId: location.state.roomId,
                name: location.state.name

            });
        }

        init();

    },[]);

    const [clients, setClients] = useState([{id:1,name:"Nitish K"}, {id:2, name:"Ram A"},{id:3, name:"Tam A"},{id:4, name:"Bam A"},{id:5, name:"Sam A"},{id:6, name:"Jam A"}])
    return (
        <>
            <Grid container
                  sx={{backgroundColor: "background.default",
                  }}
            >
                <Grid item xs={12} sx={{height:"8vh",pt:2}}>
                    <Box sx={{display: "flex", justifyContent:"space-between",alignItems:"center"}}>
                        <Typography variant="h1" sx={{color:"white",fontSize:35, fontWeight:700,ml:1}}>
                            CodeCollab.
                        </Typography>

                        <Box sx={{display:"flex"}}>
                            <AvatarGroup max={4} sx={{mr:5}}>
                                {clients.map((client)=> {
                                    return( <Avatar key ={client.id} alt={client.name}  />)
                                })}
                            </AvatarGroup>
                            <Button variant="contained" sx={{height:"50px",mr:5}} onClick={() => navigate("/")}>Leave Space</Button>
                        </Box>

                    </Box>
                </Grid>
                <Grid item xs={1} sx={{height:"92vh",backgroundColor:"background.alter"}}>
                    Sidebar
                </Grid>
                <Grid item xs={11} sx={{height:"92vh"}}>
                    <Editor/>
                </Grid>
            </Grid>
        </>
    );
}

export default CodeSpace;