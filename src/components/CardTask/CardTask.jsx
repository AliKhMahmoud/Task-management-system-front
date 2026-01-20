import { LuCalendarDays } from "react-icons/lu"
import "./CardTask.css"

const CardTask = ({title, priority, description, endDate, fullName}) => {
    const getInitials = (name) => {
        if (!name) return ""; 
        const nameParts = name.trim().split(" "); 
        if (nameParts.length > 1) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        return nameParts[0].substring(0, 2).toUpperCase();
    }
    return (
        <div className="cardTask">
            <div className="taskHeader">
                <h2>{title}</h2>
                <span className={`status-dot ${priority}`}></span>
            </div>
            <p className="description">{description}</p>
            <div className="taskFooter">
                <div className="dateInfo">
                    <LuCalendarDays className="calendar-icon" />
                    <span className="endDate">{endDate}</span>
                </div>
                <p className="userIcon">{getInitials(fullName)}</p>
            </div>
        </div>
    )
}

export default CardTask
