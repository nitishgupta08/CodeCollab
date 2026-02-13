import { io } from "socket.io-client";

const options = {
  reconnection: true,
  reconnectionAttempts: Infinity,
  autoConnect: false,
  transports: ["websocket"],
};

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL || "";

export const socket = io(backendUrl, options);
