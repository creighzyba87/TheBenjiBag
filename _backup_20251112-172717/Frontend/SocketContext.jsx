import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const SocketProvider = ({ children, user }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            // Add auth token to connection if needed, but for now, we rely on the session cookie
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            // Join a room based on role or user ID
            if (user.role === 'admin') {
                newSocket.emit('joinRoom', 'admin');
            } else if (user.role === 'customer') {
                newSocket.emit('joinRoom', `customer-${user.id}`);
            } else if (user.role === 'driver') {
                newSocket.emit('joinRoom', `driver-${user.id}`);
            }
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
