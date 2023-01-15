import { Typography, Box, IconButton } from '@mui/material'
import React, { useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Sidebar({ data, setData, setValue }) {

    const editFile = () => {

    }

    const deleteFile = (fileName) => {
        console.log(data.length);
        setData(data.filter((i) => i.fileName !== fileName));
        setValue(data.length);
    }


    const goToFile = (fileName) => {
        const i = data.findIndex(x => x.fileName === fileName);
        setValue(i);
    }


    return (
        <Box sx={{ p: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>
                Space Name
            </Typography>
            {data && data.map((item, id) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: 15, cursor: "pointer" }} onClick={() => goToFile(item.fileName)}>
                            {item.fileName}
                        </Typography>
                        <Box>
                            <IconButton sx={{ color: "inherit" }} onClick={editFile}>
                                <EditIcon />
                            </IconButton>
                            <IconButton sx={{ color: "inherit" }} onClick={() => deleteFile(item.fileName)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}

export default Sidebar