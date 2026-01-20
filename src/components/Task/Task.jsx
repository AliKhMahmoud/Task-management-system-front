import { useState, useEffect } from "react";
import AddTask from "../AddTask/AddTask";
import CardTask from "../CardTask/CardTask";
import "./Task.css";
import { FaPlus } from "react-icons/fa";

const Task = ({ onTaskSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/tasks", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include" 
                });
                const data = await response.json();
                if (response.ok) {
                    setTasks(data.data || data); 
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const columns = [
        { id: 'pending', label: 'TO DO', class: 'to-do-col' },
        { id: 'in_progress', label: 'In Progress', class: 'in-progress-col' },
        { id: 'completed', label: 'Completed', class: 'completed-col' },
        { id: 'on_hold', label: 'On Hold', class: 'delayed-col' }
    ];

    return (
        <div className="task">
            <div className="taskNav">
                <h2 className="taskHeader">Task Board</h2>
                <div className="createTask">
                    <button onClick={() => setIsModalOpen(true)}> 
                        <FaPlus /> create Task
                    </button>
                </div>
            </div>

            <AddTask 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            <div className="taskContent">
                {columns.map((col) => (
                    <div key={col.id} className={`column ${col.class}`}>
                        <div className="header">
                            <h3>{col.label}</h3>
                            <div className="Count">{getTasksByStatus(col.id).length}</div>
                        </div>
                        <div className="task-body">
                            {getTasksByStatus(col.id).map(task => (
                                <div 
                                    key={task._id} 
                                    className="task-card-wrapper"
                                    onClick={() => onTaskSelect && onTaskSelect(task)} 
                                    style={{ cursor: 'pointer', width: '100%' }}
                                >
                                    <CardTask 
                                        title={task.title}
                                        priority={task.priority}
                                        description={task.description}
                                        endDate={new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        fullName={task.assignedTo?.name || "Unassigned"}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Task;