
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5173'; 

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true, 
    transports: ['websocket', 'polling'] 
});