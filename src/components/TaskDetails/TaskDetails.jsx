import React, { useState, useEffect } from 'react';
import './TaskDetails.css';
import { IoCalendarOutline, IoPersonOutline, IoFolderOutline, IoSend, IoClose } from "react-icons/io5"; 
import { MdCheckCircle } from "react-icons/md";

const TaskDetails = ({ task, onTaskUpdate, onClose }) => { 
    const [comment, setComment] = useState("");
    const [currentStatus, setCurrentStatus] = useState(task?.status);
    const [notes, setNotes] = useState([]);

    const fetchNotes = async () => {
        if (!task?._id) return;
        try {
            const response = await fetch(`http://localhost:5000/api/notes?task=${task._id}`, {
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                setNotes(result.data); 
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    useEffect(() => {
        if (task?._id) {
            setCurrentStatus(task.status);
            fetchNotes(); 
        }
    }, [task]);

    if (!task) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "No Date";
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleSendNote = async () => {
        if (!comment.trim()) return;
        try {
            const response = await fetch("http://localhost:5000/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: comment, 
                    task: task._id,
                    isImportant: false
                }),
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                setNotes([result.data, ...notes]); 
                setComment("");
            }
        } catch (error) {
            console.error("Error sending note:", error);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }), 
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                setCurrentStatus(newStatus);
                if (onTaskUpdate) await onTaskUpdate();
            } else {
                alert("خطأ: " + (result.message || "فشل التحديث"));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="task-details-card">
            <button className="close-details-btn" onClick={onClose} title="Close details">
                <IoClose />
            </button>

            <div className="details-header">
                <h2 className="details-title">{task.title}</h2>
                <span className={`status-badge ${currentStatus?.replace('_', '-')}`}>
                    {currentStatus?.replace('_', ' ')}
                </span>
            </div>

            <div className="details-meta">
                <div className="meta-item">
                    <IoPersonOutline className="meta-icon" />
                    <span>Assigned to: <strong>{task.assignedTo?.name || "Member"}</strong></span>
                </div>
                <div className="meta-item">
                    <IoCalendarOutline className="meta-icon" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                </div>
                <div className="meta-item">
                    <IoFolderOutline className="meta-icon" />
                    <span>Project: <span className="project-tag">{task.project?.name || "General"}</span></span>
                </div>
            </div>

            <div className="details-description">
                <h3>Description</h3>
                <p>{task.description}</p>
            </div>

            <div className="update-status-section">
                <h3>Update Status</h3>
                <div className="status-controls">
                    <select 
                        className="status-select" 
                        value={currentStatus} 
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                    >
                        <option value="pending">Pending / To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                    </select>

                    <button 
                        className="mark-done-btn"
                        onClick={() => handleUpdateStatus("completed")} 
                    >
                        <MdCheckCircle /> Mark as Done
                    </button>
                </div>
            </div>

            <div className="comments-section">
                <h3>Comments & Notes</h3>
                <div className="comments-list">
                    {notes.map((n) => (
                        <div className="comment-item" key={n._id}>
                            <div className="user-avatar">
                                {n.createdBy?.name?.charAt(0) || "U"}
                            </div>
                            <div className="comment-content">
                                <div className="comment-info">
                                    <strong>{n.createdBy?.name}</strong> 
                                    <span>{formatDate(n.createdAt)}</span>
                                </div>
                                <div className="comment-bubble">{n.content}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-comment">
                    <input 
                        type="text" 
                        placeholder="Add a comment or note..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendNote()}
                    />
                    <button className="send-btn" onClick={handleSendNote}>
                        <IoSend />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;