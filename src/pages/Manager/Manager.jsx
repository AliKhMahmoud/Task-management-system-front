import { CgDarkMode } from "react-icons/cg"
import { MdNotificationsNone } from "react-icons/md"
import { RiAdminLine } from "react-icons/ri"
import NavBar from "../../components/NavBar/NavBar"
import './Manager.css'
import { FaPlus } from "react-icons/fa"
import AddProject from "../../components/AddProject/AddProject"
import { useState } from "react"
import Task from "../../components/Task/Task"
import StartsCards from "../../components/StartsCards/StartsCards"
import { LuActivity, LuFileText, LuLayoutDashboard, LuListTodo, LuUsers } from "react-icons/lu"
import Member from "../../components/ListMember/ListMember"
import TaskDetails from "../../components/TaskDetails/TaskDetails"
import ActivityLog from "../../components/ActivityLog/ActivityLog"
import Reports from "../../components/Reports/Reports"

const Manager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedTask, setSelectedTask] = useState(null);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSelectedTask(null); 
    };

    return (
        <div className="whiteSpacing manager">
            <NavBar
                dashboard="Management System" 
                roleIcon={<RiAdminLine />}
                role="Manager" 
                notices={<MdNotificationsNone />}
                mood={<CgDarkMode />}
            />
            <div className="content">
                <div className="info">
                    <h2>Admin Dashboard</h2>
                    <p>Manage your team, projects, and tasks</p>
                </div>
                <div className="newProject">
                    <button onClick={() => setIsModalOpen(true)}> 
                        <FaPlus /> new project
                    </button>
                </div>
            </div>
            
            <AddProject 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            <div className="tabs-bar">
                <button onClick={() => handleTabChange('Overview')} className={activeTab === 'Overview' ? 'active' : ''}>
                    <LuLayoutDashboard /> Overview
                </button>
                <button onClick={() => handleTabChange('Tasks')} className={activeTab === 'Tasks' ? 'active' : ''}>
                    <LuListTodo /> Tasks
                </button>
                <button onClick={() => handleTabChange('Team')} className={activeTab === 'Team' ? 'active' : ''}>
                    <LuUsers /> Team
                </button>
                <button onClick={() => handleTabChange('Activity')} className={activeTab === 'Activity' ? 'active' : ''}>
                    <LuActivity /> Activity
                </button>
                <button onClick={() => handleTabChange('Reports')} className={activeTab === 'Reports' ? 'active' : ''}>
                    <LuFileText/> Reports
                </button>
            </div>

            <div className="tab-content">
                {selectedTask && (
                    <div className="task-details-overlay" onClick={() => setSelectedTask(null)}> 
                        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                            <TaskDetails 
                                task={selectedTask} 
                                onClose={() => setSelectedTask(null)} 
                                onTaskUpdate={() => {
                                    setSelectedTask(null); 
                                }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'Overview' && (
                    <>
                        <StartsCards />
                        <Task onTaskSelect={(task) => setSelectedTask(task)} /> 
                    </>
                )}

                {activeTab === 'Tasks' && (
                    <Task onTaskSelect={(task) => setSelectedTask(task)} />
                )}

                {activeTab === 'Team' && <Member />}
                {activeTab === 'Activity' && <ActivityLog />}
                {activeTab === 'Reports' && <Reports/>}
            </div>            
        </div>
    )
}

export default Manager