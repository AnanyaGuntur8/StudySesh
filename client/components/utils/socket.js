import { useEffect } from 'react';
import { io } from 'socket.io-client';

let socket;

const getSocket = () => {
    if (!socket) {
        socket = io('http://192.168.1.105:8080'); // Adjust the URL as necessary

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }
    return socket;
};

export { getSocket };