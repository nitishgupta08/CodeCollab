// First we need to import axios.js
import axios from "axios";
// Next we make an 'instance' of it
const instance = axios.create({
  // where we make our configurations
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.REACT_APP_BACKEND_URL ||
    "",
});

instance.interceptors.request.use((config) => {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (user?.token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// Also add/ configure interceptors && all the other cool stuff

export default instance;
