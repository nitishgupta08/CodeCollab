import { Box, Card, CardContent, CardActions, Typography, IconButton } from '@mui/material'
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../UserContext';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { CustomTextField } from '../reuseable';

function YourSpaces({ setMessage, setOpen, setEopen }) {

    const [listSpace, setListSpace] = useState(null);
    const { currentUser } = useContext(UserContext);
    const user = JSON.parse(currentUser)

    const getSpaces = () => {
        axios.get("http://localhost:8000/api/spaces", {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    setListSpace(res.data);
                }
            }).catch((err) => {
                setMessage({ title: "error!", data: err.response.data.message })
                setEopen(true)
            });
    }

    useEffect(() => {
        getSpaces();
    }, [])

    return (
        <>

            <Box>
                {listSpace && listSpace.map((item, id) => {
                    return (
                        <SpaceCard
                            key={id}
                            item={item}
                            user={user}
                            getSpaces={getSpaces}
                            setMessage={setMessage}
                            setOpen={setOpen}
                            setEopen={setEopen}
                        />
                    )
                })}
            </Box>
        </>
    )
}

const SpaceCard = ({ item, user, getSpaces, setMessage, setEopen, setOpen }) => {

    const date = new Date(item.createdAt);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState(item.spaceName);
    const navigate = useNavigate()


    const handleDelete = () => {
        axios.delete(`http://localhost:8000/api/spaces/${item._id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    getSpaces();
                    setMessage({ title: "Space deleted", data: `${item.spaceName} deleted` })
                    setOpen(true);
                }
            }).catch((err) => {
                setMessage({ title: "Cannot delete space", data: "Please try again later." })
                setEopen(true);
            });
    }

    const copySpaceId = () => {
        navigator.clipboard.writeText(item.spaceId);
        setOpen(true);
        setMessage({ title: "Copied!", data: "Spaceid copied to clipboard." })
    }


    const goToSpace = () => {
        navigate(`/codespace/${item.spaceId}`, {
            state: {
                spaceId: item.spaceId,
                name: user.name,
            }
        });
    }

    const handleEdit = () => {

    }

    return (

        <Card sx={{ backgroundColor: "background.alter", m: 1, display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
            <CardContent>
                {edit ? <CustomTextField
                    autoFocus
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ width: "400px", mb: 1 }}
                /> : <Typography variant="h4" sx={{ fontSize: 20, fontWeight: 700, mb: 1 }}>
                    {item.spaceName}
                </Typography>}

                <Typography variant="h5" sx={{ fontSize: 15, opacity: "0.5", mb: 1 }}>
                    {item.spaceId}
                </Typography>

                <Typography variant="p" sx={{ fontSize: 11 }}>
                    Created at: {date.toDateString()} {date.toLocaleTimeString()}
                </Typography>

            </CardContent>
            <CardActions>
                {edit ? (
                    <>
                        <IconButton onClick={handleEdit}>
                            <CheckIcon />
                        </IconButton>
                        <IconButton onClick={() => setEdit(false)}>
                            <CloseIcon />
                        </IconButton>
                    </>
                ) :
                    <>
                        <IconButton>
                            <ContentCopyIcon onClick={copySpaceId} />
                        </IconButton>
                        <IconButton onClick={() => setEdit(true)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                }

            </CardActions>
            <Box>
                {!edit && <IconButton>
                    <RocketLaunchIcon onClick={goToSpace} />
                </IconButton>}

            </Box>

        </Card>
    )
}

export default YourSpaces