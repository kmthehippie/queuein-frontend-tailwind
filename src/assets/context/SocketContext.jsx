import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL);
    setSocket(newSocket);

    return () => {
      console.log("Socket Provider unmounting - disconnecting socket");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("Trying to create a new socket!", socket);
  }, [socket]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
