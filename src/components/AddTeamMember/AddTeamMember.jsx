import React, { useState } from 'react';
import './AddTeamMember.css';
import { IoClose } from "react-icons/io5"; 

const AddTeamMember = ({ isOpen, onClose, onMemberAdded }) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Team Member",
        password: ""
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
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Member Added Successfully!");
                onMemberAdded(); 
                onClose(); 
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error adding member:", error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <div className="header-text">
                        <h2>Add Team Member</h2>
                        <p>Add a new team member to your workspace. They will receive an invitation email.</p>
                    </div>
                    <button className="close-icon-btn" onClick={onClose}>
                        <IoClose size={24} />
                    </button>
                </div>

                <form className="member-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            name="name"
                            type="text" 
                            placeholder="John Doe" 
                            required 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            placeholder="john@company.com" 
                            required 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            name="password"
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            minLength="6"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Role</label>
                        <div className="select-wrapper">
                            <select name="role" onChange={handleChange} value={formData.role}>
                                <option value="Team Member">Team Member</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-add" disabled={loading}>
                            {loading ? "Adding..." : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeamMember;