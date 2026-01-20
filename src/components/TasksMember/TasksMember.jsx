import './TasksMember.css';
import { IoCalendarOutline } from "react-icons/io5";

const TasksMember = ({ tasks, onTaskSelect, selectedTaskId }) => {
    
    
    const formatDate = (dateString) => {
        if (!dateString) return "No Date";
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="tasks-container">
            {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                    <div 
                        onClick={() => onTaskSelect(task)}
                        className={`task-card-member ${selectedTaskId === task._id ? 'active' : ''}`} 
                        key={task._id}
                    >
                        <div className="task-card-header">
                            <div className="header-info">
                                <h3 className="task-title">{task.title}</h3>
                                <span className="project-name">
                                    {task.project?.name || "No Project"}
                                </span>
                            </div>
                            
                            <span className={`status-badge ${task.status.toLowerCase().replace('_', '-')}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>

                        <p className="task-description">
                            {task.description}
                        </p>

                        <div className="task-card-footer">
                            <div className="task-date">
                                <IoCalendarOutline className="calendar-icon" />
                                <span>{formatDate(task.dueDate)}</span>
                            </div>
                            
                            <div className={`priority-badge ${task.priority?.toLowerCase()}`}>
                                {task.priority} Priority
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-tasks">No tasks assigned to you yet.</p>
            )}
        </div>
    );
};

export default TasksMember;