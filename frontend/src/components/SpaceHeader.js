import React from 'react'
import { Box, Button, Avatar, AvatarGroup, Typography, IconButton } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import uniqolor from 'uniqolor';
import { Link, useNavigate } from "react-router-dom";
import { HtmlTooltip } from '../reuseable'


function SpaceHeader({ active, loggedInUser, handleSave }) {
    const navigate = useNavigate()
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: 'flex', alignItems: "flex-end" }}>
                <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 35, fontWeight: 700, mr: 5 }}>
                    CodeCollab.
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
    )
}

export default SpaceHeader