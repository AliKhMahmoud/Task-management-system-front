import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { MdEmail, MdLock } from "react-icons/md";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include" 
            });

            const data = await response.json();

            if (response.status === 200 && data.message === 'Logged in Successfully') {
                const userRole = data.role ? data.role.toLowerCase() : "";

                if (userRole === "manager" || userRole === "admin") {
                    navigate("/manager");
                } else if (userRole === "team member") {
                    navigate("/member");
                } else {
                    alert("Unauthorized access: Role not recognized.");
                }
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Connection error. Please check your server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h1>System Login</h1>
                    <p>Enter your credentials to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field">
                        <MdEmail className="icon" />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="input-field">
                        <MdLock className="icon" />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected by Admin Security System</p>
                </div>
            </div>
        </div>
    );
};

export default Login;