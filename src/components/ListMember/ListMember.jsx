import { useEffect, useState } from "react";
import AddTeamMember from "../AddTeamMember/AddTeamMember"
import "./ListMember.css"
import { IoIosPersonAdd } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi"; // استيراد أيقونة الحذف

const ListMember = () => {
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const fetchData = async () => {
        try {
            const fetchOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include" 
            };

            const userRes = await fetch("http://localhost:5000/api/users", fetchOptions);
            const userData = await userRes.json();
            
            const taskRes = await fetch("http://localhost:5000/api/tasks", fetchOptions);
            const taskData = await taskRes.json();

            if (userRes.ok) {
                const finalUsers = userData.data?.docs || userData.data || userData || [];
                setUsers(finalUsers); 
            }
                    
            if (taskRes.ok) {
                setTasks(taskData.data || taskData || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // دالة حذف العضو
    const handleDeleteMember = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to remove ${userName}?`)) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (response.ok) {
                    // تحديث القائمة بعد الحذف
                    fetchData();
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || "Failed to delete member");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getTaskCountForUser = (userId) => {
        return tasks.filter(task => 
            (task.assignedTo === userId) || (task.assignedTo?._id === userId)
        ).length;
    };

    return (
        <div className="memberContainer">
            <div className="members">
                <h2>Team Members</h2>
                <button onClick={() => setIsMemberModalOpen(true)}>
                    <IoIosPersonAdd />
                    <span>Add Member</span>
                </button>
            </div>
            
            <AddTeamMember 
                isOpen={isMemberModalOpen} 
                onClose={() => setIsMemberModalOpen(false)} 
                onMemberAdded={fetchData}
            />

            <div className="memberHead">
                <span>Member</span>
                <span>Email</span>
                <span>Role</span>
                <span>Current Tasks</span>
                <span>Action</span> {/* إضافة عنوان للعمود الجديد */}
            </div>

            <div className="memberList">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div className="memberBody" key={user._id}>
                            <span className="memberName">{user.name}</span>
                            <span className="memberEmail">{user.email}</span>
                            <span className="memberRole">{user.role}</span>
                            <span className="memberTaskCount">
                                <span className="task-badge">
                                    {getTaskCountForUser(user._id)} Tasks
                                </span>
                            </span>
                            {/* زر الحذف السريع */}
                            <span className="memberAction">
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteMember(user._id, user.name)}
                                    title="Delete Member"
                                >
                                    <FiTrash2 />
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No members found.</div>
                )}
            </div>
        </div>
    )
}

export default ListMember;