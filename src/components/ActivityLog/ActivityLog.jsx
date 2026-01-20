import React, { useEffect, useState } from 'react';
import './ActivityLog.css';
import { FiClock, FiMessageSquare, FiCheckCircle, FiPlusCircle, FiUser, FiRefreshCcw, FiInfo } from "react-icons/fi";

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/activity-logs", {
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                setLogs(result.data);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionDetails = (action) => {
        const act = action.toLowerCase();
        // Updated text to English for better UI consistency
        if (act.includes('note_create')) return { text: "added a new note to", icon: <FiMessageSquare />, color: "#3b82f6", bg: "#eff6ff" };
        if (act.includes('task_status_update')) return { text: "updated the status of", icon: <FiRefreshCcw />, color: "#f59e0b", bg: "#fffbeb" };
        if (act.includes('task_create')) return { text: "created a new task:", icon: <FiPlusCircle />, color: "#10b981", bg: "#ecfdf5" };
        if (act.includes('auth_login')) return { text: "logged into the system", icon: <FiUser />, color: "#6366f1", bg: "#eef2ff" };
        
        return { text: action.replace(/_/g, ' '), icon: <FiInfo />, color: "#6b7280", bg: "#f3f4f6" };
    };

    if (loading) return <div className="activity-loader">Loading activities...</div>;

    return (
        <div className="activity-wrapper">
            <div className="activity-header">
                <h3>Recent System Activities</h3>
                <button onClick={fetchLogs} className="refresh-btn"><FiRefreshCcw /> Refresh</button>
            </div>
            
            <div className="activity-list">
                {logs.length > 0 ? logs.map((log) => {
                    const details = getActionDetails(log.action);
                    return (
                        <div className="activity-card" key={log._id}>
                            <div className="activity-icon" style={{ color: details.color, backgroundColor: details.bg }}>
                                {details.icon}
                            </div>
                            <div className="activity-info">
                                <div className="activity-main-text">
                                    <span className="user-name">{log.user?.name || "System"}</span>
                                    <span className="action-text">{details.text}</span>
                                    <span className="entity-name">{log.entityType}</span>
                                </div>
                                <div className="activity-meta">
                                    <FiClock size={12} />
                                    <span>{new Date(log.createdAt).toLocaleString('en-GB')}</span>
                                </div>
                            </div>
                        </div>
                    );
                }) : <p className="no-data">No activities recorded yet.</p>}
            </div>
        </div>
    );
};

export default ActivityLog;