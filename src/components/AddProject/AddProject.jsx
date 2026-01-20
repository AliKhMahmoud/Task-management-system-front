import { useState } from 'react';
import './AddProject.css';

const AddProject = ({ isOpen, onClose, onProjectCreated }) => {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: ""
    });

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Project Created Successfully!");
                if (onProjectCreated) onProjectCreated(); 
                onClose(); 
            } else {
                alert(data.message || "Failed to create project");
            }
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create New Project</h2>
                    <p>Enter the details to start a new team project</p>
                </div>
                
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Project Name</label>
                        <input 
                            name="name"
                            type="text" 
                            placeholder="e.g. E-commerce Website" 
                            required 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea 
                            name="description"
                            placeholder="Briefly describe the project goals..." 
                            rows="4"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="date-group">
                        <div className="input-group">
                            <label>Start Date</label>
                            <input 
                                name="startDate"
                                type="date" 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>End Date</label>
                            <input 
                                name="endDate"
                                type="date" 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={onClose} 
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-create" 
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProject;