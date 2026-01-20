import { Routes, Route, Navigate } from "react-router-dom";
import Manager from "./pages/Manager/Manager";
import Member from "./pages/Member/Member";
import Login from "./pages/Login/Login";
import { socket } from './utils/socket';
import { useEffect } from "react";

function App() {
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            console.log("Waiting for user to login...");
            return;
        }

        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        if (userId) {
            if (!socket.connected) {
                socket.connect();
            }

            const onConnect = () => {
                console.log("✅ Socket connected with credentials!");
                socket.emit('join', userId);
            };

            const onNotification = (data) => {
                console.log("🚀 Notification Received:", data);
                alert(`New Notification: ${data.message}`);
            };

            socket.on("connect", onConnect);
            socket.on("notification", onNotification);

            return () => {
                socket.off("connect", onConnect);
                socket.off("notification", onNotification);
            };
        }
    }, []); 

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/manager/*" element={<Manager />} />
            <Route path="/member/*" element={<Member />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;