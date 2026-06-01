import { useEffect } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../services/api";

// shared socket instance
let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, { withCredentials: true });
  }
  return socket;
};

// subscribe to a socket event for the lifetime of the component
export const useSocketEvent = (event, handler) => {
  useEffect(() => {
    const s = getSocket();
    s.on(event, handler);
    return () => {
      s.off(event, handler);
    };
  }, [event, handler]);
};
