import React, { useEffect, useState } from 'react';
import { FaFilePdf, FaProjectDiagram } from 'react-icons/fa';
import './Reports.css';

const Reports = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("!!! Reports Component Loaded !!!")
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects', {
                    credentials: 'include'
                });
                const data = await response.json();
                console.log("Projects Data:", data)
                if (response.ok) {
                    setProjects(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleDownloadPDF = async (projectId, projectName) => {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}/report`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report-${projectName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert("Error generating report");
        }
    };

    if (loading) return <div className="loading">Loading Reports...</div>;

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>System Reports</h2>
                <p>Generate and export detailed project performance reports.</p>
            </div>

            <div className="reports-grid">
                {projects.map((project) => (
                    <div key={project._id} className="report-card">
                        <div className="card-icon">
                            <FaProjectDiagram />
                        </div>
                        <div className="card-info">
                            <h3>{project.name}</h3>
                            <span>Project ID: {project._id.substring(0, 8)}...</span>
                        </div>
                        <button 
                            className="download-btn"
                            onClick={() => handleDownloadPDF(project._id, project.name)}
                        >
                            <FaFilePdf /> Export PDF
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;