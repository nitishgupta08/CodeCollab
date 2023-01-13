import './App.css';
import {useState,useMemo,useEffect} from "react";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import CodeSpace from "./pages/CodeSpace";
import { createTheme, ThemeProvider } from '@mui/material';
import Dashboard from "./pages/Dashboard";
import {UserContext} from "./UserContext";

function App() {

    const theme = createTheme({
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
        palette: {
            primary: {
                main: "#72BC92",
            },

            secondary: {
                main: "#ABCEB6",
            },

            background: {
                default: "#21094E",
                paper: "#724EA7",
                alter: "#A68DCC"
            },
            text: {
                primary: "#EAE8EE",
                secondary: "#fff",
            },
        }
    });

    // #EAE8EE,#ABCEB6,#72BC92,#A68DCC,#724EA7,#21094E

    const [currentUser, setCurrentUser] = useState(null);
    const providerValue = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser, setCurrentUser]);

    //Load the user from storage
    useEffect(() => {
        const u = localStorage.getItem("user");
        u ? setCurrentUser(u) : setCurrentUser(null);
    }, []);

    // store user in local storage everytime user changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("user", currentUser);
        }
    }, [currentUser]);

    return (
    <>
        <ThemeProvider theme={theme}>
            <UserContext.Provider value={providerValue}>
                <BrowserRouter>
                    <Routes>
                        {!currentUser && <Route path="/" element={<Home/>}/>}

                        {currentUser &&  <Route path="/dashboard" element={<Dashboard/>}/>}


                        <Route path="/codespace/:roomId" element={<CodeSpace/>}/>
                        <Route
                            path="*"
                            element={<Navigate to={currentUser ? "/dashboard" : "/"} />}
                        />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </ThemeProvider>

    </>
  );
}

export default App;
