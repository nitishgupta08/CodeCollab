import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { UserContext } from "./context/UserContext";
import Home from "./pages/Home";
import Space from "./pages/Space";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    palette: {
      primary: {
        main: "#00E5B5",
      },

      secondary: {
        main: "#ABCEB6",
      },

      background: {
        default: "#090b28",
        paper: "#0e103d",
        secondary: "#181b66",
        alter: "#4f0147",
      },
      text: {
        primary: "#EAE8EE",
        secondary: "#fff",
      },
    },
  });

  const [loggedInUser, setLoggedInUser] = useState(null);
  // const [loggedInUser, setLoggedInUser] = useLocalStorage("user", null);
  const providerValue = useMemo(
    () => ({ loggedInUser, setLoggedInUser }),
    [loggedInUser, setLoggedInUser]
  );

  // //Load the user from storage
  // useEffect(() => {
  //   const u = localStorage.getItem("user");
  //   u ? setLoggedInUser(u) : setLoggedInUser(null);
  // }, []);
  //
  // // store user in local storage everytime user changes
  // useEffect(() => {
  //   if (loggedInUser) {
  //     localStorage.setItem("user", loggedInUser);
  //   }
  // }, [loggedInUser]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={providerValue}>
          <BrowserRouter>
            <Routes>
              {loggedInUser ? (
                <Route path="/dashboard" element={<Dashboard />} />
              ) : (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </>
              )}

              <Route path="/space/:spaceId" element={<Space />} />
              {/*<Route*/}
              {/*  path="*"*/}
              {/*  element={<Navigate to={loggedInUser  ? "/dashboard" : "/"} />}*/}
              {/*/>*/}
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
