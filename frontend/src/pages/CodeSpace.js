import React, { useContext, useEffect, useState, useReducer } from 'react';
import { Grid, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import uniqid from 'uniqid';
import axios from 'axios'
import Editor from "../components/Editor";
import { UserContext } from "../UserContext";
import { editorThemes } from '../editorThemes';
import SpaceHeader from '../components/SpaceHeader';
import SpaceSidebar from "../components/SpaceSidebar";
import SpaceTabs from "../components/SpaceTabs";
import SpaceSettings from "../components/SpaceSettings";

const initialState = {
    spaceData : null,
    tabsData: null,
    loadingScreen: true,
    spaceName: "",
    currentFileData: "",
    activeUsers: null,
    editorTheme: editorThemes[0].value,
    editorLanguageIndex: 0,
    sideTabValue: 0,
    topTabValue: 0,
}

function reducer(state, action) {
    switch (action.type) {
        case "updateSpaceData":
            return { ...state, spaceData: action.payload };
        case "updateTabsData":
            return { ...state, tabsData: action.payload };
        case "removeLoadingScreen":
            return { ...state, loadingScreen: false };
        case "updateSpaceName":
            return { ...state, spaceName: action.payload };
        case "updateSideTab":
            return { ...state, sideTabValue: action.payload };
        case "updateTopTab":
            return { ...state, topTabValue: action.payload };
        case "updateEditorTheme":
            return { ...state, editorTheme: action.payload };
        case "updateEditorLanguage":
            return { ...state, editorLanguageIndex: action.payload };
        case "updateCurrentFileData":
            return { ...state, currentFileData: action.payload };
        default:
            throw new Error();
    }
}



function CodeSpace() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const location = useLocation();
    const { currentUser } = useContext(UserContext);
    const loggedInUser = currentUser ? JSON.parse(currentUser) : null;



    useEffect(() => {
        axios.get(`http://localhost:8000/api/spaces/${location.state.spaceId}`).then((res) => {
            if (res.status === 200) {
                dispatch({type: 'updateSpaceData', payload: res.data.spaceData});
                dispatch({type: 'updateTabsData', payload: [res.data.spaceData[0]]});
                dispatch({type: 'updateSpaceName', payload: res.data.spaceName});
                dispatch({type: 'removeLoadingScreen'});
            }
        })
    }, [])




    // save data
    const handleSave = () => {
        const index = state.spaceData.findIndex(x => state.tabsData[state.topTabValue].id === x.id);
        let newData = [...state.spaceData];
        newData[index].fileData = state.currentFileData
        dispatch({type: 'updateSpaceData', payload: newData})

        const user = JSON.parse(localStorage.getItem("user"))
        axios.put(`http://localhost:8000/api/spaces/${location.state.spaceId}`,

            {
                spaceData: state.spaceData,
                activeUsers: state.activeUsers
            }
            , {
                headers: { Authorization: `Bearer ${user.token}` }
            })
    }


    return (
        <>
            <Backdrop
                sx={{ backgroundColor: 'background.default', zIndex: 2, display: "flex", flexDirection: "column" }}
                open={state.loadingScreen}
            >
                <CircularProgress size={100} />
                <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 35, fontWeight: 700, mt: 5 }}>
                    Loading Space...
                </Typography>
            </Backdrop>
            <Grid container sx={{ backgroundColor: 'background.default',minHeight: '100vh' }}>
                <Grid item xs={12} sx={{ p: 1, height: '5vh' }}>
                    <SpaceHeader
                        active={state.activeUsers}
                        handleSave={handleSave}
                        loggedInUser={loggedInUser}
                    />
                </Grid>

                <Grid item xs={1.5} sx={{height: '95vh'}}>
                    <SpaceSidebar
                        loggedInUser={loggedInUser}
                        spaceName={state.spaceName}
                        spaceData={state.spaceData}
                        topTabsData={state.tabsData}
                        value={state.sideTabValue}
                        spaceId={location.state.spaceId}
                        dispatch={dispatch}
                    />
                </Grid>
                <Grid item xs={10.5} sx={{height: '95vh'}}>
                    <Grid item xs={12} sx={{pt:1,height: '5vh', display: 'flex'}}>
                        <Grid item xs={10}>
                            <SpaceTabs
                                topTabsData={state.tabsData}
                                value={state.topTabValue}
                                spaceData={state.spaceData}
                                dispatch={dispatch}
                                loggedInUser={loggedInUser}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <SpaceSettings
                                theme={state.editorTheme}
                                dispatch={dispatch}
                            />
                        </Grid>
                    </Grid>


                    <Grid item xs={12}>
                        <Editor
                            data={state.tabsData && state.tabsData[state.topTabValue]}
                            loggedInUser={loggedInUser}
                            theme={state.editorTheme}
                            language={state.editorLanguageIndex}
                            dispatch={dispatch}
                        />
                    </Grid>

                </Grid>
            </Grid>
        </>
    );
}

export default CodeSpace;