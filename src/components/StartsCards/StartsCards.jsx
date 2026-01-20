import "./StartsCards.css"
import { IoBagCheckOutline } from "react-icons/io5"
import { FaCheckCircle } from "react-icons/fa"
import { MdAccessTime } from "react-icons/md"
import { useEffect, useState } from "react"

const StartsCards = () => {
    const [stats, setStats] = useState({ activeProjects: 0, completedTasks: 0, pendingRequests: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include' 
                };

                const projectsResponse = await fetch("http://localhost:5000/api/projects", fetchOptions);
                const projectsResult = await projectsResponse.json();

                const tasksResponse = await fetch("http://localhost:5000/api/tasks", fetchOptions);
                const tasksResult = await tasksResponse.json();

                if (projectsResponse.ok && tasksResponse.ok) {
                    const projects = projectsResult.data || [];
                    const tasks = tasksResult.data || [];

                    setStats({
                        activeProjects: projects.filter(p => p.status === 'active').length,
                        completedTasks: tasks.filter(t => t.status === 'completed').length,
                        pendingRequests: tasks.filter(t => t.status === 'pending').length
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="startsCards">
            <div className="activeProjects">
                <div className="info">
                    <p>Total Active Projects</p>
                    <span>{stats.activeProjects}</span>
                </div>
                <IoBagCheckOutline size={50} color="#0c56a6ff" />
            </div>

            <div className="completedTask">
                <div className="info">
                    <p>Completed Tasks</p>
                    <span>{stats.completedTasks}</span>
                </div>
                <FaCheckCircle size={50} color="#0ca659ff"/>
            </div>

            <div className="pendengs">
                <div className="info">
                    <p>Pending Requests</p>
                    <span>{stats.pendingRequests}</span>
                </div>
                <MdAccessTime size={50} color="#cb1e52ff" />
            </div>
        </div>
    )
}

export default StartsCards;