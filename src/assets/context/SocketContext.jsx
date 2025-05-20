// SocketContext.jsx
import React, { createContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = useCallback(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected!");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected!");
      setIsConnected(false);
    });

    return newSocket;
  }, []);

  const reconnect = useCallback(() => {
    console.log("Attempting to reconnect socket...");
    if (socket) {
      socket.disconnect();
    }
    connectSocket();
  }, [socket, connectSocket]);

  useEffect(() => {
    const initialSocket = connectSocket();
    return () => {
      console.log("Socket Provider unmounting - disconnecting socket");
      initialSocket?.disconnect();
    };
  }, [connectSocket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
