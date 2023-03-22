import { Route, Routes, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Home from "./pages/Home";
import Space from "./pages/Space";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import useLocalStorage from "./hooks/useLocalStorage";
import useAuth from "./hooks/useAuth";
import { useEffect } from "react";

function App() {
  const { auth } = useAuth();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          {auth && <Route path="dashboard" element={<Dashboard />} />}

          {!auth && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </>
          )}

          <Route path="space/:spaceId" element={<Space />} />

          <Route
            path="*"
            element={<Navigate to={auth ? "/dashboard" : "/"} />}
          />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
