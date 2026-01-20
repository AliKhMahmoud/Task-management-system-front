import { useState, useEffect } from "react";
import "./AddTask.css";

const AddTask = ({ isOpen, onClose, onTaskCreated }) => {
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        project: "",
        priority: "medium", 
        assignedTo: "",
        dueDate: "", 
        status: "pending" 
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const fetchOptions = { credentials: "include" };
                try {
                    const projectRes = await fetch("http://localhost:5000/api/projects", fetchOptions);
                    const projectData = await projectRes.json();
                    
                    const memberRes = await fetch("http://localhost:5000/api/users", fetchOptions);
                    const memberData = await memberRes.json();

                    if (projectRes.ok) setProjects(projectData.data || projectData);
                    if (memberRes.ok) setMembers(memberData.data.docs || []);
                } catch (error) {
                    console.error("Error fetching data for modal:", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.project || !formData.assignedTo || !formData.dueDate) {
            alert("Please fill in all required fields (Project, Member, and Due Date)");
            return;
        }

        setLoading(true);

        const taskData = {
            title: formData.title,
            description: formData.description,
            project: formData.project,
            assignedTo: formData.assignedTo,
            dueDate: formData.dueDate, 
            priority: formData.priority.toLowerCase(), 
        };

        try {
            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(taskData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Task created successfully!");
                if (onTaskCreated) onTaskCreated();
                onClose();
            } else {
                console.error("Validation Details:", result.errors);
                alert(`Error: ${result.message || "Validation Failed"}`);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Check your connection or server status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div>
                        <h2>Create New Task</h2>
                        <p>Assign a new task to your team.</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title</label>
                        <input name="title" type="text" placeholder="e.g., Design homepage" required onChange={handleChange} value={formData.title} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" placeholder="Describe the task..." onChange={handleChange} value={formData.description}></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Project</label>
                            <select name="project" required onChange={handleChange} value={formData.project}>
                                <option value="">Select project</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select name="priority" onChange={handleChange} value={formData.priority}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Assign To</label>
                            <select name="assignedTo" required onChange={handleChange} value={formData.assignedTo}>
                                <option value="">Select member</option>
                                {members.map(m => (
                                    <option key={m._id} value={m._id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input name="dueDate" type="date" required onChange={handleChange} value={formData.dueDate} />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Assigning..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTask;