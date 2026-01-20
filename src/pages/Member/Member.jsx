import { useState, useEffect } from "react";
import { RiAdminLine } from "react-icons/ri";
import NavBar from "../../components/NavBar/NavBar";
import { MdNotificationsNone } from "react-icons/md";
import { CgDarkMode } from "react-icons/cg";
import "./Member.css";
import TasksMember from "../../components/TasksMember/TasksMember";
import TaskDetails from "../../components/TaskDetails/TaskDetails"; 

const Member = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);


    const fetchMyTasks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/tasks/myTasks", { 
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                setTasks([...result.data]); 
                
                if (selectedTask) {
                    const updated = result.data.find(t => t._id === selectedTask._id);
                    if (updated) setSelectedTask({...updated});
                }
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchMyTasks ()
    }, []);


    return (
        <div className="member whiteSpacing">
            <NavBar
                dashboard="Management System" 
                roleIcon={<RiAdminLine />}
                role="Member" 
                notices={<MdNotificationsNone />}
                mood={<CgDarkMode />}
            />
            
            <div className="content-wrapper whiteSpacing">
                <div className="info">
                    <h2>My Workspace</h2>
                    <p>View and manage your assigned tasks</p>
                </div>
                <div className="tasks-section">
                    <div className="task-list-container">
                        <div className="list-header">
                            <h2>My Tasks</h2>
                            <p className="task-count">
                                {`${tasks.length} tasks assigned to you`}
                            </p>
                        </div>
                        

                        <TasksMember 
                            tasks={tasks} 
                            onTaskSelect={(task) => setSelectedTask(task)} 
                            selectedTaskId={selectedTask?._id}
                        />
                    </div>

                    <div className="details-section">
                        {selectedTask ? (
                            <TaskDetails 
                                task={selectedTask} 
                                onTaskUpdate={fetchMyTasks}
                                onClose={() => setSelectedTask(null)} 
                            />
                        ) : (
                            <div className="empty-details">
                                <p>Select a task from the list to see its full details and comments.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default Member;