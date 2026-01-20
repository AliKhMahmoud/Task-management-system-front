import './NavBar.css'

const NavBar = ({dashboard, roleIcon, role, notices, mood}) => {
    return (
        <div className="navBar">
            <h1>{dashboard}</h1>
            <div className="content">
                <div className="role">
                    <span className="icon">{roleIcon}</span>
                    <p>{role}</p>
                </div>
                <div className="notices-icon">
                    {notices}
                </div>
                <div className="mood-toggle">
                    {mood}
                </div>
            </div>
        </div>
    )
}

export default NavBar



