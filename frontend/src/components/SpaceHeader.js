import React from 'react'
import { Box, Button, Avatar, AvatarGroup, Typography, IconButton, Divider } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import uniqolor from 'uniqolor';
import { Link, useNavigate } from "react-router-dom";
import { HtmlTooltip } from '../reuseable'
import SpaceSettings from "./SpaceSettings";


function SpaceHeader({ active, loggedInUser, handleSave, theme,dispatch }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: 'flex', alignItems: "flex-end" }}>
                <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 35, fontWeight: 700, mr: 4 }}>
                    CodeCollab.
                </Typography>

                <SpaceSettings
                    theme={theme}
                    dispatch={dispatch}
                />
            </Box>

            <HtmlTooltip
                title={
                    <React.Fragment>
                        {active && active.map((client, id) => {
                            return client.userData.email ?
                                (<Box sx={{mb:1}} key={id}>
                                        <Typography  color='text.primary' sx={{fontSize:20, fontWeight:700}}>{client.userData.name}</Typography>
                                        <Typography color='text.primary' sx={{opacity: 0.7}}>can edit this space.</Typography>
                                        <Divider sx={{backgroundColor: 'text.primary'}}/>
                                    </Box>
                                ) :
                                (<Box sx={{mb:1}} key={id} >
                                        <Typography  color='text.primary' sx={{fontSize:20, fontWeight:700}}>{client.userData.name}</Typography>
                                        <Typography color='text.primary' sx={{opacity: 0.7}}>can only view this space.</Typography>
                                        <Divider sx={{backgroundColor: 'text.primary'}}/>
                                    </Box>

                                )
                        })}
                    </React.Fragment>
                }
            >
                <AvatarGroup max={6}>
                    {active && active.map((client, id) => {
                        return (<Avatar key={id} sx={{ backgroundColor: uniqolor(client.userData.name).color }}>{client.userData.name[0]}</Avatar>)
                    })}
                </AvatarGroup>
            </HtmlTooltip>


            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {loggedInUser &&
                    <IconButton onClick={handleSave} sx={{ color: 'text.primary' }}>
                        <SaveIcon />
                    </IconButton>
                }

                <Button variant="contained" sx={{ ml: 1 }} onClick={() => { loggedInUser ? navigate("/dashboard") : navigate("/") }}>Leave Space</Button>
            </Box>
        </Box>
    )
}

export default SpaceHeader