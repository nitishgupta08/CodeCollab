import React, {useState} from 'react'
import {
    Box,
    Typography,
    IconButton,
    Slide,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Backdrop, Snackbar, Alert, AlertTitle
} from "@mui/material";
import {DataStyledTabs, DataStyledTab, CustomTextField, CustomInput} from '../reuseable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";
import uniqid from "uniqid";
import {editorLang} from "../editorLang";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ACTIONS from '../Actions'
import {useLocation} from "react-router-dom";

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}



function SpaceSidebar({spaceName, spaceData, loggedInUser, value, dispatch, topTabsData, spaceId, socketRef}) {
    const [bdo, setBdo] = useState(false);
    const [bdo1, setBdo1] = useState(false);
    const [editid, setEditid] = useState('');
    const [file,setFile] = useState({name: "", langIndex: 0});
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ title: "", data: "" });
    const location = useLocation()

    const newFile = () => {
        let fileobj = {
            id: uniqid(),
            fileName: file.name,
            lang: file.langIndex,
            fileData: ''
        };

        let copyarr = topTabsData;
        copyarr.push(fileobj);
        dispatch({type:'updateTabsData',payload:copyarr});
        dispatch({type:'updateTopTab',payload:topTabsData.length-1});
        dispatch({type:'updateEditorLanguage',payload:fileobj.lang});

        copyarr = spaceData;
        copyarr.push(fileobj);

        dispatch({type:'updateSpaceData',payload:copyarr});
        dispatch({type:'updateSideTab',payload:spaceData.length-1});

        setFile({name:'',langIndex: 0});
        setBdo(false);

        socketRef.current.emit(ACTIONS.SPACEDATA_CHANGE, {
            spaceData: copyarr,
            type: 1,
            name: location.state.name,
            spaceId: location.state.spaceId,
        })
    }


    // check function on edge cases
    const deleteFile = (id) => {
        const topIndex = topTabsData.findIndex(item => item.id === id);
        const sideTabIndex = spaceData.findIndex(item => item.id === id);

        let newspacearr = spaceData.filter(item => item.id !== id);
        let newtoparr = topTabsData.filter(item => item.id !== id);
        dispatch({type:'updateSpaceData',payload:newspacearr});
        dispatch({type:'updateTabsData',payload:newtoparr});

        if(topIndex !== -1)   dispatch({type:'updateTopTab',payload: topIndex === 0 ? topIndex : topIndex-1});
        if(sideTabIndex !== -1) dispatch({type:'updateSideTab',payload: sideTabIndex === 0 ? sideTabIndex :  sideTabIndex-1});
    }

    const goToFile = (id) => {
        let i = spaceData.findIndex(x => x.id === id);
        if (topTabsData.find((item) => item.id === id)) {
            const topIndex = topTabsData.findIndex(x => x.id === id);
            dispatch({type:'updateTopTab',payload: topIndex})
        } else {
            let newTopArr = topTabsData;
            newTopArr.push(spaceData[i]);
            dispatch({type:'updateTabsData',payload:newTopArr});
            dispatch({type:'updateTopTab',payload: topTabsData.length-1})
        }
    }


    const editFile = () => {
        const si = spaceData.findIndex(item => item.id === editid);
        let newarr = spaceData;
        newarr[si].fileName = file.name;
        newarr[si].lang = file.langIndex;

        dispatch({type:'updateSpaceData',payload:newarr});

        const oi = topTabsData.findIndex(item => item.id === editid);
        newarr = topTabsData;
        newarr[oi].fileName = file.name;
        newarr[oi].lang = file.langIndex;

        dispatch({type:'updateTabsData',payload:newarr});

        setFile({name:'',langIndex: 0});
        setBdo1(false);
    }

    const copySpaceId = () => {
        navigator.clipboard.writeText(spaceId);
        setOpen(true);
        setMessage({ title: "Copied!", data: "Spaceid copied to clipboard." })
    }

    return (
        <>
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
            <Backdrop
                sx={{ color: '#fff', zIndex: 2, backdropFilter: "blur(4px)" }}
                open={bdo}
            >
                <Slide direction="up" in={bdo} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            width: "25vw",
                            backgroundColor: "background.secondary",
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "column",
                            p: 3,
                        }}>
                        <Typography variant="h2" sx={{ color: "text.primary", fontSize: 30, fontWeight: 700, mb: 4 }}>
                            give your file a name.
                        </Typography>
                        <Box sx={{display:'flex',alignItems:'center', justifyContent:'space-between'}}>
                            <CustomTextField
                                autoFocus
                                name="name"
                                placeholder="Enter name"
                                sx={{ width: 350, maxWidth: "100%", mb: 2,mr:1 }}
                                value={file.name}
                                onChange={(e) => setFile({...file, name: e.target.value})}
                            />
                            <FormControl sx={{ width: 150}} size="small">
                                <InputLabel>Language</InputLabel>
                                <Select
                                    value={file.langIndex}
                                    onChange={(e) => setFile({...file, langIndex: e.target.value})}
                                    label="Language"
                                    input={<CustomInput />}

                                >
                                    {editorLang.map((lang, id) => {
                                        return <MenuItem value={lang.index} key={id}>{lang.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>


                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex" }}>
                                <Button variant="contained" sx={{ height: "43px", mr: 2 }} onClick={newFile}>Create</Button>
                                <Button variant="contained" sx={{ height: "43px" }} onClick={() => setBdo(false)}>Cancel</Button>
                            </Box>
                        </Box>
                    </Box>
                </Slide>
            </Backdrop>


                <Backdrop
                    sx={{ color: '#fff', zIndex: 2, backdropFilter: "blur(4px)" }}
                    open={bdo1}
                >
                <Slide direction="up" in={bdo1} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            width: "25vw",
                            backgroundColor: "background.secondary",
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "column",
                            p: 3,
                        }}>
                        <Typography variant="h2" sx={{ color: "text.primary", fontSize: 30, fontWeight: 700, mb: 4 }}>
                            edit your file.
                        </Typography>
                        <Box sx={{display:'flex',alignItems:'center', justifyContent:'space-between'}}>
                            <CustomTextField
                                autoFocus
                                name="name"
                                placeholder="Enter name"
                                sx={{ width: 350, maxWidth: "100%", mb: 2,mr:1 }}
                                value={file.name}
                                onChange={(e) => setFile({...file, name: e.target.value})}
                            />
                            <FormControl sx={{ width: 150}} size="small">
                                <InputLabel>Language</InputLabel>
                                <Select
                                    value={file.langIndex}
                                    onChange={(e) => setFile({...file, langIndex: e.target.value})}
                                    label="Language"
                                    input={<CustomInput />}

                                >
                                    {editorLang.map((lang, id) => {
                                        return <MenuItem value={lang.index} key={id}>{lang.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>


                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex" }}>
                                <Button variant="contained" sx={{ height: "43px", mr: 2 }} onClick={editFile}>Update</Button>
                                <Button variant="contained" sx={{ height: "43px" }} onClick={() => setBdo1(false)}>Cancel</Button>
                            </Box>
                        </Box>
                    </Box>
                </Slide>

            </Backdrop>

            <Box sx={{ p: 1 }}>
                <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: 20 }}>
                    {spaceName}
                </Typography>
                <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: 12, opacity: 0.7 }}>
                        Files in this space:
                    </Typography>
                    <Box >
                        {loggedInUser && (<IconButton sx={{ color: "text.primary" }} onClick={()=>setBdo(true)}>
                            <AddIcon />
                        </IconButton>)}
                    </Box>
                </Box>

                <Box sx={{flexGrow: 1, display: 'flex',height: '80vh'}}>
                    <DataStyledTabs
                        value={value}
                        onChange={(event,newValue) => dispatch({type: 'updateSideTab', payload: newValue})}
                        variant="scrollable"
                        orientation="vertical"
                        scrollButtons="auto"
                    >
                        {spaceData && spaceData.map((item, id) => {
                            return (
                                <DataStyledTab disableRipple
                                               onClick={() => goToFile(item.id)}
                                               sx={{width:'100%',minWidth: '200px'}}
                                               label={
                                                   <Box component="span" sx={{}} >
                                                       <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: 15, position: 'absolute' ,left:5,top:15}}>
                                                           {item.fileName}
                                                       </Typography>

                                                       {loggedInUser && id===value ? (
                                                           <Box sx={{ position: 'absolute' ,right:2,top:5 }}>
                                                           <IconButton sx={{ color: "text.primary" }} onClick={() => {
                                                               setFile({name: item.fileName, langIndex: item.lang});
                                                               setEditid(item.id);
                                                               setBdo1(true);
                                                           } }>
                                                               <EditIcon />
                                                           </IconButton>
                                                           <IconButton sx={{ color: "text.primary" }} onClick={() => deleteFile(item.id)}>
                                                               <DeleteIcon />
                                                           </IconButton>
                                                       </Box>) : null}
                                                   </Box>
                                               }
                                               key={id} />
                            )
                        })}

                    </DataStyledTabs>
                </Box>
                <Box sx={{display:'flex',justifyContent:'center'}}>
                    <Button variant="contained" onClick={copySpaceId} startIcon={<ContentCopyIcon />}>Space Id</Button>
                </Box>
            </Box>
        </>

    )
}

export default SpaceSidebar